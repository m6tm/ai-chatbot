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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageIcon, MusicIcon, VideoIcon } from "lucide-react"

type MediaGeneratorProps = {
  onGenerate?: (type: "image" | "video" | "music", prompt: string) => void
}

export function MediaGenerator({ onGenerate }: MediaGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [mediaType, setMediaType] = useState<"image" | "video" | "music">("image")
  const [prompt, setPrompt] = useState("")
  const [imageStyle, setImageStyle] = useState("photorealistic")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [musicDuration, setMusicDuration] = useState(30)
  const [videoDuration, setVideoDuration] = useState(15)

  const handleGenerate = () => {
    if (onGenerate && prompt) {
      onGenerate(mediaType, prompt)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ImageIcon className="h-4 w-4" />
          Générer du contenu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Générateur de contenu</DialogTitle>
          <DialogDescription>
            Créez des images, vidéos ou musiques à partir de descriptions textuelles
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="image" onValueChange={(value) => setMediaType(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <VideoIcon className="h-4 w-4" />
              Vidéo
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <MusicIcon className="h-4 w-4" />
              Musique
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Description</Label>
              <Textarea
                id="prompt"
                placeholder={
                  mediaType === "image"
                    ? "Un paysage de montagne au coucher du soleil..."
                    : mediaType === "video"
                      ? "Une animation d'une ville futuriste..."
                      : "Une mélodie relaxante avec des sons de la nature..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <TabsContent value="image" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Style</Label>
                <RadioGroup value={imageStyle} onValueChange={setImageStyle} className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="photorealistic" id="photorealistic" />
                    <Label htmlFor="photorealistic">Photoréaliste</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cartoon" id="cartoon" />
                    <Label htmlFor="cartoon">Cartoon</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="painting" id="painting" />
                    <Label htmlFor="painting">Peinture</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3d" id="3d" />
                    <Label htmlFor="3d">3D</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <RadioGroup value={aspectRatio} onValueChange={setAspectRatio} className="grid grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1:1" id="square" />
                    <Label htmlFor="square">Carré</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4:3" id="landscape" />
                    <Label htmlFor="landscape">Paysage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3:4" id="portrait" />
                    <Label htmlFor="portrait">Portrait</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Durée: {videoDuration} secondes</Label>
                </div>
                <Slider
                  min={5}
                  max={30}
                  step={5}
                  value={[videoDuration]}
                  onValueChange={(value) => setVideoDuration(value[0])}
                />
              </div>
            </TabsContent>

            <TabsContent value="music" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Durée: {musicDuration} secondes</Label>
                </div>
                <Slider
                  min={10}
                  max={60}
                  step={5}
                  value={[musicDuration]}
                  onValueChange={(value) => setMusicDuration(value[0])}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleGenerate} disabled={!prompt}>
            Générer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

