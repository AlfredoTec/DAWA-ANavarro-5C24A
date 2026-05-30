"use client"
import { useDashboard } from "@/lib/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FolderIcon, CheckCircle2Icon, UsersIcon, ClipboardListIcon } from "lucide-react"

export function OverviewTab() {
  const { projects, members, tasks } = useDashboard()

  const totalProjects = projects.length
  const completedTasks = tasks.filter(t => t.status === "Completado").length
  const activeMembers = members.filter(m => m.isActive).length
  const pendingTasks = tasks.filter(t => t.status === "Pendiente").length

  const recentTasks = [...tasks]
    .sort((a, b) => b.deadline.localeCompare(a.deadline))
    .slice(0, 4)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter(p => p.status === "Completado").length} completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTasks} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Totales</CardTitle>
            <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.filter(t => t.status === "En progreso").length} en progreso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              {members.length} en total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos Activos</CardTitle>
            <CardDescription>Estado de los proyectos en curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.filter(p => p.status !== "Completado").slice(0, 5).map(p => (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate">{p.name}</span>
                    <span className="text-muted-foreground shrink-0 ml-2">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}
              {projects.filter(p => p.status !== "Completado").length === 0 && (
                <p className="text-sm text-muted-foreground">No hay proyectos activos.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tareas Recientes</CardTitle>
            <CardDescription>Últimas tareas por fecha límite</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map(task => {
                const user = members.find(m => m.userId === task.userId)
                return (
                  <div key={task.id} className="flex items-center gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {user ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.description}</p>
                      <p className="text-xs text-muted-foreground">{user?.name ?? "Sin asignar"} · {task.status}</p>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">{task.deadline || "—"}</div>
                  </div>
                )
              })}
              {recentTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay tareas registradas.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
