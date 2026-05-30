"use client"
import { useState } from "react"
import { useDashboard, type Project } from "@/lib/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircleIcon, PlusIcon, Trash2Icon, EyeIcon } from "lucide-react"

const STATUS_OPTIONS = ["Planificado", "En progreso", "En revisión", "Completado"]
const CATEGORY_OPTIONS = [
  { value: "web", label: "Desarrollo Web" },
  { value: "mobile", label: "Desarrollo Mobile" },
  { value: "design", label: "Diseño" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Otro" },
]
const PRIORITY_OPTIONS = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
]

function statusVariant(s: string): "default" | "secondary" | "outline" {
  if (s === "Completado") return "default"
  if (s === "En revisión") return "secondary"
  return "outline"
}

type FormData = {
  name: string
  description: string
  category: string
  priority: string
  status: string
  progress: string
  memberIds: string[]
}

const EMPTY_FORM: FormData = {
  name: "", description: "", category: "", priority: "", status: "Planificado", progress: "0", memberIds: [],
}

function validate(f: FormData): string[] {
  const errors: string[] = []
  if (!f.name.trim()) errors.push("El nombre es obligatorio.")
  if (!f.category) errors.push("La categoría es obligatoria.")
  if (!f.priority) errors.push("La prioridad es obligatoria.")
  const p = Number(f.progress)
  if (isNaN(p) || p < 0 || p > 100) errors.push("Progreso debe estar entre 0 y 100.")
  return errors
}

export function ProjectsTab() {
  const { projects, members, addProject, deleteProject } = useDashboard()
  const [createOpen, setCreateOpen] = useState(false)
  const [detailProject, setDetailProject] = useState<Project | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (errs.length) { setErrors(errs); return }
    setErrors([])
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    addProject({
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
      status: form.status,
      progress: Number(form.progress),
      memberIds: form.memberIds,
    })
    setSaving(false)
    setForm(EMPTY_FORM)
    setCreateOpen(false)
  }

  const handleDelete = async (id: string) => {
    deleteProject(id)
  }

  const toggleMember = (uid: string) => {
    setForm(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(uid)
        ? prev.memberIds.filter(x => x !== uid)
        : [...prev.memberIds, uid],
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Proyectos</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setForm(EMPTY_FORM); setErrors([]) }}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                <DialogDescription>Completa la información del proyecto.</DialogDescription>
              </DialogHeader>
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
                  <Label htmlFor="name">Nombre <span className="text-destructive">*</span></Label>
                  <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Mi Proyecto" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Descripción</Label>
                  <Input id="desc" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción breve..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Categoría <span className="text-destructive">*</span></Label>
                    <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Prioridad <span className="text-destructive">*</span></Label>
                    <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                      <SelectTrigger><SelectValue placeholder="Prioridad" /></SelectTrigger>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Estado</Label>
                    <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="progress">Progreso (%)</Label>
                    <Input id="progress" type="number" min={0} max={100} value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Miembros del equipo</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2 rounded-md border p-3">
                    {members.length === 0 && <p className="text-sm text-muted-foreground">No hay miembros registrados.</p>}
                    {members.map(m => (
                      <div key={m.userId} className="flex items-center gap-2">
                        <Checkbox
                          id={`m-${m.userId}`}
                          checked={form.memberIds.includes(m.userId)}
                          onCheckedChange={() => toggleMember(m.userId)}
                        />
                        <Label htmlFor={`m-${m.userId}`} className="cursor-pointer font-normal">
                          {m.name} <span className="text-muted-foreground text-xs">({m.role})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={saving}>Cancelar</Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <><Spinner className="mr-2" /> Guardando...</> : "Crear Proyecto"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!detailProject} onOpenChange={open => !open && setDetailProject(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {detailProject && (
            <>
              <DialogHeader>
                <DialogTitle>{detailProject.name}</DialogTitle>
                <DialogDescription>{detailProject.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="flex gap-2">
                  <Badge variant={statusVariant(detailProject.status)}>{detailProject.status}</Badge>
                  <Badge variant="outline">{PRIORITY_OPTIONS.find(p => p.value === detailProject.priority)?.label ?? detailProject.priority}</Badge>
                  <Badge variant="secondary">{CATEGORY_OPTIONS.find(c => c.value === detailProject.category)?.label ?? detailProject.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Progreso</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${detailProject.progress}%` }} />
                    </div>
                    <span className="text-sm font-medium w-10 text-right">{detailProject.progress}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Miembros del equipo ({detailProject.memberIds.length})</p>
                  {detailProject.memberIds.length === 0
                    ? <p className="text-sm">Sin miembros asignados.</p>
                    : <div className="space-y-1">
                        {detailProject.memberIds.map(uid => {
                          const m = members.find(x => x.userId === uid)
                          return m ? (
                            <div key={uid} className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                                {m.name[0]}
                              </div>
                              <span>{m.name}</span>
                              <span className="text-muted-foreground">— {m.role}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                  }
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailProject(null)}>Cerrar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge variant={statusVariant(project.status)} className="ml-2 shrink-0">{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{project.memberIds.length} miembro{project.memberIds.length !== 1 ? "s" : ""}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setDetailProject(project)}>
                      <EyeIcon className="h-4 w-4 mr-1" />Ver
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(project.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
