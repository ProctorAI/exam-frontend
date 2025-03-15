"use client"

import { 
  LayoutDashboard,
  GraduationCap,
  Trophy,
  LineChart,
  Settings,
  Brain,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavSection } from "@/components/navigation/nav-section"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NavProfile } from "@/components/navigation/nav-profile";
import useUser from "@/hooks/use-user";


const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your progress",
  },
  {
    title: "Tests",
    href: "/tests",
    icon: GraduationCap,
    description: "Take and review tests",
  },

  {
    title: "My Performance",
    href: "/performance",
    icon: LineChart,
    description: "Track your progress",
  },
]

const settingsItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage your preferences",
  },
]

export function AppSidebar() {
  const { data: user } = useUser()

  if (!user) return null
  return (
    <Sidebar className="">
      <SidebarHeader>
        <div className="relative border-b border-border/20 bg-gradient-to-b from-background/90 to-background/40 px-6 py-4 backdrop-blur-xl dark:from-background/80 dark:to-background/20">
          <Link href="/" className="relative flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                ProctorAI
              </h1>
              <p className="text-[10px] font-medium text-muted-foreground">
                Intelligent Exam Monitoring
              </p>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-background/80 to-background/20 dark:from-background/60 dark:to-background/0">
        <div className="space-y-4 py-4">
          <NavSection 
            label="Navigation"
            items={navigationItems}
          />
          <NavSection 
            label="Preferences"
            items={settingsItems}
          />
        </div>
      </SidebarContent>
      <SidebarRail className="" />
      <SidebarFooter className="border-t border-border/20 bg-gradient-to-t from-background/90 to-background/40 px-6 py-3 backdrop-blur-xl dark:from-background/80 dark:to-background/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
            <span className="text-xs font-medium text-muted-foreground">Connected</span>
          </div>
          <div className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border/10 backdrop-blur dark:bg-background/50 dark:ring-border/5">
            v1.0.0
          </div>
        </div>
        <NavProfile user={user} />
      </SidebarFooter>
    </Sidebar>
  );
} 