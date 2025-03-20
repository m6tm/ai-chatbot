"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export type Model = {
  id: string
  name: string
  description: string
  capabilities: string[]
}

const models: Model[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Le modèle le plus avancé, capable de comprendre des images et de générer du texte de haute qualité.",
    capabilities: ["Texte", "Images", "Analyse"],
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Une version plus rapide de GPT-4 avec un bon équilibre entre performance et vitesse.",
    capabilities: ["Texte", "Analyse"],
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Un modèle rapide et économique pour les tâches de génération de texte standard.",
    capabilities: ["Texte"],
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    description: "Le modèle le plus puissant d'Anthropic, excellent pour les tâches complexes.",
    capabilities: ["Texte", "Images", "Analyse"],
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    description: "Un bon équilibre entre performance et efficacité.",
    capabilities: ["Texte", "Images"],
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 (70B)",
    description: "Le modèle open-source le plus avancé de Meta.",
    capabilities: ["Texte"],
  },
]

type ModelSelectorProps = {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedModelData = models.find((model) => model.id === selectedModel) || models[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedModelData.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un modèle..." />
          <CommandList>
            <CommandEmpty>Aucun modèle trouvé.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onModelChange(model.id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedModel === model.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

