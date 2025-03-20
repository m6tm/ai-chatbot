"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Settings, Palette, Bell, Shield, Database } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { ModelSelector } from "@/components/model-selector"

type SettingsPanelProps = {
  defaultModel: string
  onModelChange: (modelId: string) => void
}

export function SettingsPanel({ defaultModel, onModelChange }: SettingsPanelProps) {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [temperature, setTemperature] = useState(0.7)
  const [autoSave, setAutoSave] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [apiKey, setApiKey] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Paramètres</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Paramètres</DialogTitle>
          <DialogDescription>Personnalisez votre expérience de chat IA</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="min-h-[300px]">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="general" className="flex flex-col items-center py-2 px-4">
              <Settings className="h-4 w-4 mb-1" />
              <span className="text-xs">Général</span>
            </TabsTrigger>
            <TabsTrigger value="model" className="flex flex-col items-center py-2 px-4">
              <Database className="h-4 w-4 mb-1" />
              <span className="text-xs">Modèle</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex flex-col items-center py-2 px-4">
              <Palette className="h-4 w-4 mb-1" />
              <span className="text-xs">Apparence</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col items-center py-2 px-4">
              <Bell className="h-4 w-4 mb-1" />
              <span className="text-xs">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex flex-col items-center py-2 px-4">
              <Shield className="h-4 w-4 mb-1" />
              <span className="text-xs">Confidentialité</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Sauvegarde automatique</Label>
                <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
              <p className="text-sm text-muted-foreground">Sauvegarde automatiquement vos conversations</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">Clé API personnalisée (optionnel)</Label>
              <Input id="api-key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." />
              <p className="text-sm text-muted-foreground">Utilisez votre propre clé API pour les requêtes</p>
            </div>
          </TabsContent>

          <TabsContent value="model" className="space-y-4">
            <div className="space-y-2">
              <Label>Modèle IA</Label>
              <ModelSelector selectedModel={defaultModel} onModelChange={onModelChange} />
              <p className="text-sm text-muted-foreground">
                Sélectionnez le modèle IA à utiliser pour vos conversations
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature">Température: {temperature}</Label>
                <span className="text-sm text-muted-foreground">{temperature}</span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <p className="text-sm text-muted-foreground">
                Contrôle la créativité des réponses (0 = déterministe, 1 = créatif)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setTheme("light")}
                >
                  Clair
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setTheme("dark")}
                >
                  Sombre
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setTheme("system")}
                >
                  Système
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notifications</Label>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <p className="text-sm text-muted-foreground">Recevoir des notifications pour les nouvelles réponses</p>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-2">
              <Label>Confidentialité des données</Label>
              <p className="text-sm text-muted-foreground">
                Vos conversations sont stockées localement sur votre appareil. Aucune donnée n'est partagée sans votre
                consentement.
              </p>
            </div>
            <Button variant="destructive">Effacer toutes les données</Button>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

