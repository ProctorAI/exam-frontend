import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

async function triggerRiskScoring(testId: string) {
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/scoring/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test_id: testId,
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
      user_id: log.user_id,
      test_id: log.test_id,
      device_type: log.device_type,
      screen_width: log.screen_width,
      screen_height: log.screen_height,
      window_width: log.window_width,
      window_height: log.window_height,
    }));

    // Store logs in the database
    const { error } = await supabase.from('proctoring_logs').insert(formattedLogs);

    if (error) {
      console.error("[PROCTORING_LOGS_ERROR]", error);
      return new NextResponse("Database Error", { status: 500 });
    }

    // If we have a test ID, trigger risk scoring
    const testId = formattedLogs[0]?.test_id;
    if (testId) {
      await triggerRiskScoring(testId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PROCTORING_LOGS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}