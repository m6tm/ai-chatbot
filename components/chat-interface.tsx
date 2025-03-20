"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { useConversations } from "@/lib/conversation-store"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { PlusIcon, Loader2 } from "lucide-react"
import { nanoid } from "nanoid"
import { FileUpload, type UploadedFile } from "@/components/file-upload"
import { MediaGenerator } from "@/components/media-generator"
import { SettingsPanel } from "@/components/settings-panel"

export function ChatInterface() {
  const { currentConversation, createConversation, addMessageToConversation } = useConversations()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [selectedModel, setSelectedModel] = useState("gpt-4o")

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages:
      currentConversation?.messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
      })) || [],
    id: currentConversation?.id,
    api: "/api/chat",
  })

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Sync AI SDK messages with our conversation store
    if (currentConversation && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      const existingMessage = currentConversation.messages.find((m) => m.id === lastMessage.id)

      if (!existingMessage) {
        addMessageToConversation(currentConversation.id, {
          content: lastMessage.content,
          role: lastMessage.role as "user" | "assistant" | "system",
        })
      }
    }
  }, [messages, currentConversation, addMessageToConversation])

  const handleSendMessage = (content: string) => {
    if (!currentConversation) {
      const newConversation = createConversation()
      addMessageToConversation(newConversation.id, {
        content,
        role: "user",
      })
    } else {
      handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>)
    }
  }

  const handleFileUpload = (file: File) => {
    const fileId = nanoid()

    // Create a new file object with upload progress
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
    }

    setUploadedFiles((prev) => [...prev, newFile])

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, progress: Math.min(f.progress + 20, 100) } : f)),
      )
    }, 500)

    // After "upload" is complete
    setTimeout(() => {
      clearInterval(interval)
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, progress: 100, url: URL.createObjectURL(file) } : f)),
      )

      // Add a message about the uploaded file
      if (currentConversation) {
        addMessageToConversation(currentConversation.id, {
          content: `[Fichier téléchargé: ${file.name}]`,
          role: "user",
        })
      }
    }, 2500)
  }

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleMediaGenerate = (type: "image" | "video" | "music", prompt: string) => {
    // In a real app, this would call an API to generate media
    if (currentConversation) {
      addMessageToConversation(currentConversation.id, {
        content: `[Demande de génération de ${type}: "${prompt}"]`,
        role: "user",
      })

      // Simulate a response
      setTimeout(() => {
        addMessageToConversation(currentConversation.id, {
          content: `J'ai généré ${type === "image" ? "une image" : type === "video" ? "une vidéo" : "un morceau de musique"} basé sur votre description. Voici le résultat: [${type} généré]`,
          role: "assistant",
        })
      }, 2000)
    }
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
  }

  if (!currentConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center space-y-4 max-w-md px-4">
          <h2 className="text-2xl font-bold">Bienvenue sur AI Chat</h2>
          <p className="text-muted-foreground">
            Commencez une nouvelle conversation pour discuter avec notre assistant IA.
          </p>
          <Button onClick={() => createConversation()}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouvelle conversation
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center">
          <MediaGenerator onGenerate={handleMediaGenerate} />
        </div>
        <SettingsPanel defaultModel={selectedModel} onModelChange={handleModelChange} />
      </div>

      <ScrollArea className="flex-1">
        <div className="pb-20">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
              <div className="text-center space-y-4 max-w-md px-4">
                <h2 className="text-2xl font-bold">Commencez la conversation</h2>
                <p className="text-muted-foreground">Posez une question ou demandez de l'aide à notre assistant IA.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: message.content,
                  role: message.role as "user" | "assistant" | "system",
                  createdAt: new Date(),
                }}
              />
            ))
          )}

          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="max-w-3xl mx-auto">
          {uploadedFiles.length > 0 && (
            <div className="px-4 pt-2">
              <FileUpload
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                uploadedFiles={uploadedFiles}
              />
            </div>
          )}
          <ChatInput onSend={handleSendMessage} onFileUpload={handleFileUpload} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

