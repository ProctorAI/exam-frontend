import { Metadata } from "next"
import { AppSidebar } from "@/components/global/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import { ProctorProvider } from "@/components/providers/proctor-provider"

export const metadata: Metadata = {
  title: "Dashboard - Medicine Chain",
  description: "Medicine Chain Dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProctorProvider examId="1">
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
        <Breadcrumbs />
        {/* <Header /> */}
        <main className="flex-1 container mx-auto py-6">
        {children}
      </main>
    </SidebarInset>
  </SidebarProvider>
  </ProctorProvider>
  )
} 