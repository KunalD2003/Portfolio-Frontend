"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import type { Profile } from "@/lib/types"

export function HeroSection() {
  const [profile, setProfile] = React.useState<Profile | null>(null)

  React.useEffect(() => {
    let active = true
    apiFetch<{ data: Profile }>("/profile")
      .then((response) => {
        if (active) setProfile(response.data)
      })
      .catch(() => {
        if (active) setProfile(null)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center pt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent font-medium mb-4 tracking-wide">
            Hello, I&apos;m
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance">
            {profile?.name || "Kunal Deshmukh"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            {profile?.title || "MERN Stack Developer"}
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed text-pretty">
            {profile?.bio ||
              "I build exceptional digital experiences with modern web technologies. Passionate about creating clean, efficient, and user-friendly applications."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="group">
              <Link href="#projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#contact">Contact Me</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              href={profile?.social.github || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href={profile?.social.linkedin || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
