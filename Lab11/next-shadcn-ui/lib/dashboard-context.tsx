"use client"
import { createContext, useContext, useState, ReactNode } from "react"

export type Project = {
  id: string
  name: string
  description: string
  category: string
  priority: string
  status: string
  progress: number
  memberIds: string[]
}

export type Member = {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export type Task = {
  id: string
  description: string
  projectId: string
  status: "Pendiente" | "En progreso" | "Completado"
  priority: "Baja" | "Media" | "Alta" | "Urgente"
  userId: string
  deadline: string
}

export type Settings = {
  appName: string
  timezone: string
  language: string
  emailNotifications: boolean
  autoSave: boolean
  itemsPerPage: number
}

const SEED_MEMBERS: Member[] = [
  { userId: "u1", role: "Frontend Developer", name: "María García", email: "maria@example.com", position: "Senior Dev", birthdate: "1990-03-15", phone: "555-0101", projectId: "p1", isActive: true },
  { userId: "u2", role: "Backend Developer", name: "Juan Pérez", email: "juan@example.com", position: "Mid Dev", birthdate: "1992-07-22", phone: "555-0102", projectId: "p1", isActive: true },
  { userId: "u3", role: "UI/UX Designer", name: "Ana López", email: "ana@example.com", position: "Designer", birthdate: "1995-01-10", phone: "555-0103", projectId: "p2", isActive: false },
  { userId: "u4", role: "DevOps Engineer", name: "Carlos Ruiz", email: "carlos@example.com", position: "Lead Ops", birthdate: "1988-11-05", phone: "555-0104", projectId: "p3", isActive: true },
  { userId: "u5", role: "Project Manager", name: "Laura Martínez", email: "laura@example.com", position: "PM", birthdate: "1985-09-30", phone: "555-0105", projectId: "p1", isActive: true },
]

const SEED_PROJECTS: Project[] = [
  { id: "p1", name: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "web", priority: "high", status: "En progreso", progress: 65, memberIds: ["u1", "u2", "u5"] },
  { id: "p2", name: "Mobile App", description: "Aplicación móvil con React Native", category: "mobile", priority: "medium", status: "En revisión", progress: 90, memberIds: ["u3"] },
  { id: "p3", name: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "web", priority: "low", status: "Planificado", progress: 20, memberIds: ["u4"] },
  { id: "p4", name: "API Gateway", description: "Microservicios con Node.js", category: "web", priority: "high", status: "En progreso", progress: 45, memberIds: [] },
  { id: "p5", name: "Design System", description: "Librería de componentes reutilizables", category: "design", priority: "medium", status: "Completado", progress: 100, memberIds: [] },
  { id: "p6", name: "Marketing Website", description: "Sitio web institucional", category: "marketing", priority: "medium", status: "En progreso", progress: 75, memberIds: [] },
]

const SEED_TASKS: Task[] = [
  { id: "t1", description: "Implementar autenticación", projectId: "p1", status: "En progreso", priority: "Alta", userId: "u1", deadline: "2025-11-15" },
  { id: "t2", description: "Diseñar pantalla de perfil", projectId: "p2", status: "Pendiente", priority: "Media", userId: "u3", deadline: "2025-11-20" },
  { id: "t3", description: "Configurar CI/CD", projectId: "p4", status: "Completado", priority: "Alta", userId: "u4", deadline: "2025-11-10" },
  { id: "t4", description: "Optimizar queries SQL", projectId: "p1", status: "En progreso", priority: "Urgente", userId: "u2", deadline: "2025-11-12" },
  { id: "t5", description: "Documentar API endpoints", projectId: "p4", status: "Pendiente", priority: "Baja", userId: "u5", deadline: "2025-11-25" },
  { id: "t6", description: "Crear wireframes de dashboard", projectId: "p3", status: "Completado", priority: "Media", userId: "u3", deadline: "2025-11-08" },
  { id: "t7", description: "Revisar pull requests", projectId: "p1", status: "Pendiente", priority: "Alta", userId: "u1", deadline: "2025-11-30" },
]

const SEED_SETTINGS: Settings = {
  appName: "Dashboard de Proyectos",
  timezone: "America/Lima",
  language: "es",
  emailNotifications: true,
  autoSave: true,
  itemsPerPage: 5,
}

type DashboardContextType = {
  projects: Project[]
  members: Member[]
  tasks: Task[]
  settings: Settings
  addProject: (p: Omit<Project, "id">) => void
  updateProject: (p: Project) => void
  deleteProject: (id: string) => void
  addMember: (m: Omit<Member, "userId">) => void
  updateMember: (m: Member) => void
  deleteMember: (userId: string) => void
  addTask: (t: Omit<Task, "id">) => void
  updateTask: (t: Task) => void
  deleteTask: (id: string) => void
  updateSettings: (s: Settings) => void
}

const DashboardContext = createContext<DashboardContextType | null>(null)

let nextId = 100

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS)
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS)
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [settings, setSettings] = useState<Settings>(SEED_SETTINGS)

  const addProject = (p: Omit<Project, "id">) =>
    setProjects(prev => [...prev, { ...p, id: `p${++nextId}` }])

  const updateProject = (p: Project) =>
    setProjects(prev => prev.map(x => x.id === p.id ? p : x))

  const deleteProject = (id: string) =>
    setProjects(prev => prev.filter(x => x.id !== id))

  const addMember = (m: Omit<Member, "userId">) =>
    setMembers(prev => [...prev, { ...m, userId: `u${++nextId}` }])

  const updateMember = (m: Member) =>
    setMembers(prev => prev.map(x => x.userId === m.userId ? m : x))

  const deleteMember = (userId: string) =>
    setMembers(prev => prev.filter(x => x.userId !== userId))

  const addTask = (t: Omit<Task, "id">) =>
    setTasks(prev => [...prev, { ...t, id: `t${++nextId}` }])

  const updateTask = (t: Task) =>
    setTasks(prev => prev.map(x => x.id === t.id ? t : x))

  const deleteTask = (id: string) =>
    setTasks(prev => prev.filter(x => x.id !== id))

  const updateSettings = (s: Settings) => setSettings(s)

  return (
    <DashboardContext.Provider value={{
      projects, members, tasks, settings,
      addProject, updateProject, deleteProject,
      addMember, updateMember, deleteMember,
      addTask, updateTask, deleteTask,
      updateSettings,
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider")
  return ctx
}
