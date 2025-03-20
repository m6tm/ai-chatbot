"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { nanoid } from "nanoid"

export type Message = {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  createdAt: Date
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

type ConversationContextType = {
  conversations: Conversation[]
  currentConversation: Conversation | null
  createConversation: () => Conversation
  selectConversation: (id: string) => void
  updateConversationTitle: (id: string, title: string) => void
  deleteConversation: (id: string) => void
  addMessageToConversation: (conversationId: string, message: Omit<Message, "id" | "createdAt">) => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)

  useEffect(() => {
    // Load conversations from localStorage
    try {
      const storedConversations = localStorage.getItem("conversations")
      if (storedConversations) {
        const parsedConversations = JSON.parse(storedConversations).map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          })),
        }))
        setConversations(parsedConversations)

        // Set current conversation if available
        const currentId = localStorage.getItem("currentConversationId")
        if (currentId) {
          const current = parsedConversations.find((c: Conversation) => c.id === currentId)
          if (current) {
            setCurrentConversation(current)
          }
        }
      }
    } catch (error) {
      console.error("Failed to load conversations from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    // Save conversations to localStorage whenever they change
    try {
      if (conversations.length > 0) {
        localStorage.setItem("conversations", JSON.stringify(conversations))
      }

      // Save current conversation ID
      if (currentConversation) {
        localStorage.setItem("currentConversationId", currentConversation.id)
      }
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }, [conversations, currentConversation])

  const createConversation = () => {
    const newConversation: Conversation = {
      id: nanoid(),
      title: "Nouvelle conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversation(newConversation)
    return newConversation
  }

  const selectConversation = (id: string) => {
    const conversation = conversations.find((c) => c.id === id)
    if (conversation) {
      setCurrentConversation(conversation)
    }
  }

  const updateConversationTitle = (id: string, title: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv)))

    if (currentConversation?.id === id) {
      setCurrentConversation((prev) => (prev ? { ...prev, title, updatedAt: new Date() } : null))
    }
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))

    if (currentConversation?.id === id) {
      const remainingConversations = conversations.filter((conv) => conv.id !== id)
      setCurrentConversation(remainingConversations.length > 0 ? remainingConversations[0] : null)
    }
  }

  const addMessageToConversation = (conversationId: string, message: Omit<Message, "id" | "createdAt">) => {
    const newMessage: Message = {
      ...message,
      id: nanoid(),
      createdAt: new Date(),
    }

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: new Date(),
              // Update title based on first user message if it's still the default
              title:
                conv.title === "Nouvelle conversation" && conv.messages.length === 0 && message.role === "user"
                  ? message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "")
                  : conv.title,
            }
          : conv,
      ),
    )

    if (currentConversation?.id === conversationId) {
      setCurrentConversation((prev) => {
        if (!prev) return null

        const updatedTitle =
          prev.title === "Nouvelle conversation" && prev.messages.length === 0 && message.role === "user"
            ? message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "")
            : prev.title

        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          updatedAt: new Date(),
          title: updatedTitle,
        }
      })
    }
  }

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        currentConversation,
        createConversation,
        selectConversation,
        updateConversationTitle,
        deleteConversation,
        addMessageToConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversations() {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error("useConversations must be used within a ConversationProvider")
  }
  return context
}

