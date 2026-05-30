"use client"
import { useState } from "react"
import { useDashboard, type Settings } from "@/lib/dashboard-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2Icon } from "lucide-react"

const TIMEZONES = [
  "America/Lima", "America/Bogota", "America/Mexico_City", "America/New_York",
  "America/Chicago", "America/Los_Angeles", "Europe/Madrid", "UTC",
]

const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
]

export function SettingsTab() {
  const { settings, updateSettings } = useDashboard()
  const [form, setForm] = useState<Settings>({ ...settings })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await new Promise(r => setTimeout(r, 700))
    updateSettings(form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    setForm({ ...settings })
    setSaved(false)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {saved && (
        <Alert>
          <CheckCircle2Icon className="h-4 w-4 text-primary" />
          <AlertTitle>Configuración guardada</AlertTitle>
          <AlertDescription>Los cambios se aplicaron correctamente.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* General */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Configuración básica de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="appName">Nombre de la aplicación</Label>
              <Input
                id="appName"
                value={form.appName}
                onChange={e => setForm({ ...form, appName: e.target.value })}
                placeholder="Dashboard de Proyectos"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Idioma</Label>
                <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Zona horaria</Label>
                <Select value={form.timezone} onValueChange={v => setForm({ ...form, timezone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="itemsPerPage">Elementos por página (tareas)</Label>
              <Input
                id="itemsPerPage"
                type="number"
                min={1}
                max={50}
                value={form.itemsPerPage}
                onChange={e => setForm({ ...form, itemsPerPage: Number(e.target.value) || 5 })}
                className="max-w-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones y comportamiento</CardTitle>
            <CardDescription>Preferencias de notificaciones y guardado automático</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Checkbox
                id="emailNotif"
                checked={form.emailNotifications}
                onCheckedChange={v => setForm({ ...form, emailNotifications: !!v })}
              />
              <div>
                <Label htmlFor="emailNotif" className="cursor-pointer font-medium">Notificaciones por email</Label>
                <p className="text-xs text-muted-foreground">Recibe alertas de actualizaciones en tus proyectos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Checkbox
                id="autoSave"
                checked={form.autoSave}
                onCheckedChange={v => setForm({ ...form, autoSave: !!v })}
              />
              <div>
                <Label htmlFor="autoSave" className="cursor-pointer font-medium">Guardado automático</Label>
                <p className="text-xs text-muted-foreground">Guarda cambios automáticamente al editar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle>Cuenta</CardTitle>
            <CardDescription>Información de la cuenta de usuario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Usuario</Label>
                <Input value="AlfredoNavarroDev" disabled className="bg-muted" />
              </div>
              <div className="grid gap-2">
                <Label>Rol</Label>
                <Input value="Administrador" disabled className="bg-muted" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value="alfredont1088@gmail.com" disabled className="bg-muted" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? <><Spinner className="mr-2" /> Guardando...</> : "Guardar cambios"}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset} disabled={saving}>
            Restablecer
          </Button>
        </div>
      </form>
    </div>
  )
}
