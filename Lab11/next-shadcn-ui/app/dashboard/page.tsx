"use client"
import { DashboardProvider } from "@/lib/dashboard-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/OverviewTab"
import { ProjectsTab } from "@/components/ProjectsTab"
import { TeamTab } from "@/components/TeamTab"
import { TasksTab } from "@/components/TasksTab"
import { SettingsTab } from "@/components/SettingsTab"

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-1">Dashboard de Proyectos</h1>
            <p className="text-muted-foreground">Gestiona tus proyectos y tareas</p>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="projects">Proyectos</TabsTrigger>
              <TabsTrigger value="team">Equipo</TabsTrigger>
              <TabsTrigger value="tasks">Tareas</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="projects" className="space-y-4">
              <ProjectsTab />
            </TabsContent>
            <TabsContent value="team" className="space-y-4">
              <TeamTab />
            </TabsContent>
            <TabsContent value="tasks" className="space-y-4">
              <TasksTab />
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardProvider>
  )
}
