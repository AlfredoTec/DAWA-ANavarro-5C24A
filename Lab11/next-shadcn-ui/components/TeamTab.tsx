"use client"
import { useState } from "react"
import { useDashboard, type Member } from "@/lib/dashboard-context"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircleIcon, PlusIcon, Trash2Icon, PencilIcon, CalendarIcon } from "lucide-react"

const ROLES = ["Frontend Developer", "Backend Developer", "UI/UX Designer", "DevOps Engineer", "Project Manager", "QA Engineer", "Data Analyst", "Otro"]

type FormData = {
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

const EMPTY_FORM: FormData = {
  role: "", name: "", email: "", position: "", birthdate: "", phone: "", projectId: "", isActive: true,
}

function validate(f: FormData): string[] {
  const errors: string[] = []
  if (!f.name.trim()) errors.push("El nombre es obligatorio.")
  if (!f.email.trim()) errors.push("El email es obligatorio.")
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.push("El email no tiene formato válido.")
  if (!f.role) errors.push("El rol es obligatorio.")
  return errors
}

function formatDate(iso: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
}

export function TeamTab() {
  const { members, projects, addMember, updateMember, deleteMember } = useDashboard()
  const [createOpen, setCreateOpen] = useState(false)
  const [editMember, setEditMember] = useState<Member | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [calOpen, setCalOpen] = useState(false)

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setErrors([])
    setCreateOpen(true)
  }

  const openEdit = (m: Member) => {
    setForm({
      role: m.role,
      name: m.name,
      email: m.email,
      position: m.position,
      birthdate: m.birthdate,
      phone: m.phone,
      projectId: m.projectId,
      isActive: m.isActive,
    })
    setErrors([])
    setEditMember(m)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (errs.length) { setErrors(errs); return }
    setErrors([])
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    if (editMember) {
      updateMember({ ...editMember, ...form })
      setEditMember(null)
    } else {
      addMember(form)
      setCreateOpen(false)
    }
    setSaving(false)
  }

  const MemberForm = ({ onClose }: { onClose: () => void }) => (
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
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Nombre <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" />
          </div>
          <div className="grid gap-2">
            <Label>Email <span className="text-destructive">*</span></Label>
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@empresa.com" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Rol <span className="text-destructive">*</span></Label>
            <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
              <SelectContent>
                {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Cargo / Posición</Label>
            <Input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="Ej: Senior Dev" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Teléfono</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="555-0000" />
          </div>
          <div className="grid gap-2">
            <Label>Fecha de nacimiento</Label>
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.birthdate ? formatDate(form.birthdate) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.birthdate ? new Date(form.birthdate) : undefined}
                  onSelect={d => {
                    setForm({ ...form, birthdate: d ? d.toISOString().split("T")[0] : "" })
                    setCalOpen(false)
                  }}
                  captionLayout="dropdown"
                  startMonth={new Date(1950, 0)}
                  endMonth={new Date(new Date().getFullYear() - 16, 11)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Proyecto asignado</Label>
            <Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })}>
              <SelectTrigger><SelectValue placeholder="Sin proyecto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin proyecto</SelectItem>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Estado</Label>
            <Select value={form.isActive ? "active" : "inactive"} onValueChange={v => setForm({ ...form, isActive: v === "active" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {saving ? <><Spinner className="mr-2" /> Guardando...</> : (editMember ? "Actualizar" : "Crear Miembro")}
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
            <h2 className="text-lg font-semibold">Miembros del Equipo</h2>
            <p className="text-sm text-muted-foreground">{members.filter(m => m.isActive).length} activos de {members.length} total</p>
          </div>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nuevo Miembro
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Miembro</DialogTitle>
            <DialogDescription>Agrega un nuevo miembro al equipo.</DialogDescription>
          </DialogHeader>
          <MemberForm onClose={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editMember} onOpenChange={open => !open && setEditMember(null)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Editar Miembro</DialogTitle>
            <DialogDescription>Actualiza los datos del miembro.</DialogDescription>
          </DialogHeader>
          <MemberForm onClose={() => setEditMember(null)} />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Equipo</CardTitle>
          <CardDescription>Gestiona los miembros y sus roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map(m => {
              const project = projects.find(p => p.id === m.projectId)
              return (
                <div key={m.userId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.role} · {m.position}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                      {project && <p className="text-xs text-primary mt-0.5">{project.name}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={m.isActive ? "default" : "secondary"}>
                      {m.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => openEdit(m)}>
                      <PencilIcon className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteMember(m.userId)}>
                      <Trash2Icon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {members.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No hay miembros registrados. Agrega el primero.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
