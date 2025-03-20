"use client"

import { useState } from "react"
import type { Message } from "@/lib/conversation-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Copy, Check, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react"
import { ReflectionPanel } from "@/components/reflection-panel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ChatMessageProps = {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("group py-4", isUser ? "bg-background" : "bg-muted/30")}>
      <div className="flex items-start gap-4 max-w-3xl mx-auto px-4">
        {!isUser && (
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}

        <div className={cn("flex-1", isUser ? "" : "")}>
          <p className="whitespace-pre-wrap">{message.content}</p>

          {!isUser && (
            <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                <span className="text-xs">{copied ? "Copié" : "Copier"}</span>
              </Button>

              <div className="flex items-center ml-2 space-x-1">
                <Button
                  variant={feedback === "positive" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setFeedback(feedback === "positive" ? null : "positive")}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant={feedback === "negative" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setFeedback(feedback === "negative" ? null : "negative")}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>

              <ReflectionPanel message={message} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 ml-1">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Régénérer la réponse</DropdownMenuItem>
                  <DropdownMenuItem>Continuer la génération</DropdownMenuItem>
                  <DropdownMenuItem>Expliquer plus simplement</DropdownMenuItem>
                  <DropdownMenuItem>Développer la réponse</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {isUser && (
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}

