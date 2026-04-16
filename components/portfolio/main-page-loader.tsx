"use client"

import { Sparkles } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export function MainPageLoader() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-8 text-center shadow-xl backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-accent/10 via-transparent to-accent/5" />
        <div className="relative space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex items-center justify-center gap-2 text-foreground">
            <Spinner className="h-5 w-5" />
            <span className="font-medium">Loading portfolio</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Preparing your experience...
          </p>
        </div>
      </div>
    </main>
  )
}
