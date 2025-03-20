"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, MessageSquare, Lightbulb, AlertTriangle, ThumbsUp, ThumbsDown } from "lucide-react"
import type { Message } from "@/lib/conversation-store"

type ReflectionPanelProps = {
  message: Message
}

export function ReflectionPanel({ message }: ReflectionPanelProps) {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null)
  const [feedbackText, setFeedbackText] = useState("")

  // Mock data for analysis
  const sentimentAnalysis = {
    score: 0.78,
    label: "Positif",
    keywords: ["utile", "intéressant", "informatif"],
  }

  const keyInsights = [
    "Explication détaillée des concepts",
    "Références à des sources fiables",
    "Exemples pratiques fournis",
  ]

  const potentialIssues = ["Certaines informations pourraient être simplifiées", "Manque de contexte historique"]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <BrainCircuit className="h-4 w-4 mr-1" />
          <span className="text-xs">Analyser</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>Analyse de la réponse</SheetTitle>
          <SheetDescription>Explorez et analysez le contenu généré</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="insights" className="h-[calc(100vh-100px)]">
          <TabsList className="px-6 justify-start">
            <TabsTrigger value="insights">
              <Lightbulb className="h-4 w-4 mr-1" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <MessageSquare className="h-4 w-4 mr-1" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-160px)]">
            <TabsContent value="insights" className="p-6 pt-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Analyse du sentiment</CardTitle>
                    <CardDescription>Évaluation du ton et du sentiment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Score: {sentimentAnalysis.score * 100}%</span>
                      <Badge variant="outline">{sentimentAnalysis.label}</Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${sentimentAnalysis.score * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Mots-clés détectés:</p>
                      <div className="flex flex-wrap gap-2">
                        {sentimentAnalysis.keywords.map((keyword, i) => (
                          <Badge key={i} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Points clés</CardTitle>
                    <CardDescription>Principaux insights identifiés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {keyInsights.map((insight, i) => (
                        <li key={i} className="flex items-start">
                          <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                          <span className="text-sm">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Points d'amélioration</CardTitle>
                    <CardDescription>Aspects qui pourraient être améliorés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {potentialIssues.map((issue, i) => (
                        <li key={i} className="flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                          <span className="text-sm">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="p-6 pt-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Votre feedback</CardTitle>
                    <CardDescription>Aidez-nous à améliorer les réponses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center space-x-4 mb-4">
                      <Button
                        variant={feedback === "positive" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setFeedback("positive")}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Utile
                      </Button>
                      <Button
                        variant={feedback === "negative" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setFeedback("negative")}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />À améliorer
                      </Button>
                    </div>

                    {feedback && (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Partagez vos commentaires sur cette réponse..."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <Button className="w-full">Envoyer le feedback</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

