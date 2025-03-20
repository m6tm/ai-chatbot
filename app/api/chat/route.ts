import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, model = "gpt-4o" } = await req.json()

  // Map model IDs to actual model implementations
  const modelMap: Record<string, any> = {
    "gpt-4o": openai("gpt-4o"),
    "gpt-4-turbo": openai("gpt-4-turbo"),
    "gpt-3.5-turbo": openai("gpt-3.5-turbo"),
    // In a real app, you would add other model providers here
  }

  // Default to gpt-4o if the requested model is not available
  const selectedModel = modelMap[model] || modelMap["gpt-4o"]

  const result = streamText({
    model: selectedModel,
    messages,
  })

  return result.toDataStreamResponse()
}

