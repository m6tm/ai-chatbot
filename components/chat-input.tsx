"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon, PaperclipIcon, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ChatInputProps = {
  onSend: (message: string) => void
  onFileUpload?: (file: File) => void
  isLoading: boolean
}

export function ChatInput({ onSend, onFileUpload, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSend(input)
      setInput("")
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileUpload) {
      onFileUpload(e.target.files[0])
      e.target.value = ""
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex flex-col space-y-2">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Envoyez un message..."
            className="min-h-[60px] pr-24 resize-none py-3 px-4 rounded-lg"
            disabled={isLoading}
            rows={1}
          />
          <div className="absolute bottom-2 right-2 flex items-center space-x-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <PaperclipIcon className="h-4 w-4" />
              <span className="sr-only">Joindre un fichier</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-full" disabled={isLoading}>
                  <ImageIcon className="h-4 w-4" />
                  <span className="sr-only">Générer une image</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Générer une image</h4>
                  <p className="text-sm text-muted-foreground">Décrivez l'image que vous souhaitez générer</p>
                  <Textarea placeholder="Une forêt enchantée avec des lucioles..." className="min-h-[80px]" />
                  <Button className="w-full">Générer</Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className={cn("h-8 w-8 rounded-full", input.trim() ? "bg-primary" : "bg-muted")}
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

