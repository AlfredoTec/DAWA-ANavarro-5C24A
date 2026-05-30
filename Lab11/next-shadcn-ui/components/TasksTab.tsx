"use client"
import { useState } from "react"
import { useDashboard, type Task } from "@/lib/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { AlertCircleIcon, PlusIcon, Trash2Icon, PencilIcon, CalendarIcon } from "lucide-react"

const PAGE_SIZE = 5

type FormData = {
  description: string
  projectId: string
  status: Task["status"]
  priority: Task["priority"]
  userId: string
  deadline: string
}

const EMPTY_FORM: FormData = {
  description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", deadline: "",
}

function validate(f: FormData): string[] {
  const errors: string[] = []
  if (!f.description.trim()) errors.push("La descripción es obligatoria.")
  if (!f.projectId) errors.push("El proyecto es obligatorio.")
  return errors
}

function statusVariant(s: string): "default" | "secondary" | "outline" {
  if (s === "Completado") return "default"
  if (s === "En progreso") return "secondary"
  return "outline"
}

function priorityVariant(p: string): "destructive" | "default" | "secondary" | "outline" {
  if (p === "Urgente") return "destructive"
  if (p === "Alta") return "default"
  if (p === "Media") return "secondary"
  return "outline"
}

function formatDate(iso: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
}

export function TasksTab() {
  const { tasks, projects, members, addTask, updateTask, deleteTask } = useDashboard()
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [calOpen, setCalOpen] = useState(false)

  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = tasks.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setErrors([])
    setCreateOpen(true)
  }

  const openEdit = (t: Task) => {
    setForm({
      description: t.description,
      projectId: t.projectId,
      status: t.status,
      priority: t.priority,
      userId: t.userId,
      deadline: t.deadline,
    })
    setErrors([])
    setEditTask(t)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (errs.length) { setErrors(errs); return }
    setErrors([])
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    if (editTask) {
      updateTask({ ...editTask, ...form })
      setEditTask(null)
    } else {
      addTask(form)
      setCreateOpen(false)
      setPage(Math.ceil((tasks.length + 1) / PAGE_SIZE))
    }
    setSaving(false)
  }

  const TaskForm = ({ onClose }: { onClose: () => void }) => (
    <form onSubmit={handleSave}>
      <div className="grid gap-4 py-4">
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Errores de validación</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4 space-y-1">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        <div className="grid gap-2">
          <Label>Descripción <span className="text-destructive">*</span></Label>
          <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción de la tarea..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Proyecto <span className="text-destructive">*</span></Label>
            <Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })}>
              <SelectTrigger><SelectValue placeholder="Seleccionar proyecto" /></SelectTrigger>
              <SelectContent>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Asignado a</Label>
            <Select value={form.userId || "none"} onValueChange={v => setForm({ ...form, userId: v === "none" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="Sin asignar" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin asignar</SelectItem>
                {members.map(m => <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Estado</Label>
            <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as Task["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En progreso">En progreso</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Prioridad</Label>
            <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v as Task["priority"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Baja">Baja</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Fecha límite</Label>
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.deadline ? formatDate(form.deadline) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.deadline ? new Date(form.deadline) : undefined}
                onSelect={d => {
                  setForm({ ...form, deadline: d ? d.toISOString().split("T")[0] : "" })
                  setCalOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {saving ? <><Spinner className="mr-2" /> Guardando...</> : (editTask ? "Actualizar" : "Crear Tarea")}
        </Button>
      </DialogFooter>
    </form>
  )

  return (
    <div className="space-y-4">
      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tareas</h2>
            <p className="text-sm text-muted-foreground">{tasks.length} tarea{tasks.length !== 1 ? "s" : ""} en total</p>
          </div>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Tarea</DialogTitle>
            <DialogDescription>Agrega una nueva tarea al proyecto.</DialogDescription>
          </DialogHeader>
          <TaskForm onClose={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTask} onOpenChange={open => !open && setEditTask(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
            <DialogDescription>Actualiza los datos de la tarea.</DialogDescription>
          </DialogHeader>
          <TaskForm onClose={() => setEditTask(null)} />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Tareas</CardTitle>
          <CardDescription>Administra todas las tareas · Página {safePage} de {totalPages}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Asignado</TableHead>
                  <TableHead>Fecha límite</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(task => {
                  const proj = projects.find(p => p.id === task.projectId)
                  const user = members.find(m => m.userId === task.userId)
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{task.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{proj?.name ?? "—"}</TableCell>
                      <TableCell><Badge variant={statusVariant(task.status)}>{task.status}</Badge></TableCell>
                      <TableCell><Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge></TableCell>
                      <TableCell className="text-sm">{user?.name ?? "—"}</TableCell>
                      <TableCell className="text-sm">{formatDate(task.deadline)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(task)}>
                            <PencilIcon className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteTask(task.id)}>
                            <Trash2Icon className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No hay tareas. Crea la primera.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    text="Anterior"
                    href="#"
                    onClick={e => { e.preventDefault(); setPage(p => Math.max(1, p - 1)) }}
                    aria-disabled={safePage === 1}
                    className={safePage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === safePage}
                      onClick={e => { e.preventDefault(); setPage(p) }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    text="Siguiente"
                    href="#"
                    onClick={e => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)) }}
                    aria-disabled={safePage === totalPages}
                    className={safePage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
