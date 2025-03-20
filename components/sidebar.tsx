"use client"

import { useState } from "react"
import { useConversations } from "@/lib/conversation-store"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, TrashIcon, LogOutIcon, MenuIcon, XIcon, Database } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { ThemeToggle } from "@/components/theme-toggle"

type SidebarProps = {
  selectedModel: string
}

export function Sidebar({ selectedModel = "gpt-4o" }: SidebarProps) {
  const { conversations, currentConversation, createConversation, selectConversation, deleteConversation } =
    useConversations()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleNewChat = () => {
    createConversation()
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const handleSelectConversation = (id: string) => {
    selectConversation(id)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const getModelName = (modelId: string) => {
    const modelMap: Record<string, string> = {
      "gpt-4o": "GPT-4o",
      "gpt-4-turbo": "GPT-4 Turbo",
      "gpt-3.5-turbo": "GPT-3.5",
      "claude-3-opus": "Claude 3 Opus",
      "claude-3-sonnet": "Claude 3 Sonnet",
      "llama-3-70b": "Llama 3 (70B)",
    }

    return modelMap[modelId] || modelId
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">AI Chat</h1>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <XIcon className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="px-4 mb-2">
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <Database className="h-4 w-4" />
          <span>Modèle actuel:</span>
          <Badge variant="outline">{getModelName(selectedModel)}</Badge>
        </div>
        <Button className="w-full justify-start" onClick={handleNewChat}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nouvelle conversation
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm group flex items-center justify-between",
                currentConversation?.id === conversation.id && "bg-accent",
              )}
            >
              <span className="truncate">{conversation.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(conversation.id)
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">{user?.name}</div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOutIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {isMobile && (
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40" onClick={toggleSidebar}>
          <MenuIcon className="h-5 w-5" />
        </Button>
      )}

      {isMobile ? (
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">{sidebarContent}</div>
        </div>
      ) : (
        <div className="w-64 border-r h-screen flex flex-col">{sidebarContent}</div>
      )}
    </>
  )
}

