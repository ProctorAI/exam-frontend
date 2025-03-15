import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

async function triggerRiskScoring(examId: string) {
  try {
    const response = await fetch('http://localhost:8001/scoring/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exam_id: examId,
        interval_seconds: 60, // 1-minute intervals
        window_size_seconds: 900 // 15-minute rolling window
      }),
    });

    if (!response.ok) {
      throw new Error('Risk scoring failed');
    }

    return await response.json();
  } catch (error) {
    console.error("[RISK_SCORING_ERROR]", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();

    const body = await request.json();
    const { logs } = body;

    if (!Array.isArray(logs)) {
      return new NextResponse("Invalid logs format", { status: 400 });
    }

    // Format logs to match the database schema
    const formattedLogs = logs.map(log => ({
      type: log.type,
      data: log.data || {},
      created_at: new Date(log.timestamp).toISOString(),
      user_id: log.userId, // Use the user ID from the request
      exam_id: log.examId || null,
      device_type: log.device_type || null,
      screen_width: log.screen_width || null,
      screen_height: log.screen_height || null,
      window_width: log.window_width || null,
      window_height: log.window_height || null,
    }));

    // Store logs in the database
    const { error } = await supabase.from('proctoring_logs').insert(formattedLogs);

    if (error) {
      console.error("[PROCTORING_LOGS_ERROR]", error);
      return new NextResponse("Database Error", { status: 500 });
    }

    // If we have an exam ID, trigger risk scoring
    const examId = formattedLogs[0]?.exam_id;
    if (examId) {
      await triggerRiskScoring(examId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PROCTORING_LOGS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}