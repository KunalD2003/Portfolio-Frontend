 "use client"

import * as React from "react"
import Link from "next/link"
import { Github, Linkedin } from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { Profile } from "@/lib/types"

export function Footer() {
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
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {profile?.name || "Kunal Deshmukh"}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={profile?.social.github || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href={profile?.social.linkedin || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
