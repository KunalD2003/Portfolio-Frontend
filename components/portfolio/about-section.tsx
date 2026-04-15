 "use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Code2, Layers, Zap } from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { Profile } from "@/lib/types"

export function AboutSection() {
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

  const highlights = [
    {
      icon: Code2,
      label: "Years Experience",
      value: profile?.highlights?.yearsExperience || "5+",
    },
    {
      icon: Layers,
      label: "Projects Completed",
      value: profile?.highlights?.projectsCompleted || "50+",
    },
    {
      icon: Zap,
      label: "Happy Clients",
      value: profile?.highlights?.happyClients || "30+",
    },
  ]

  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent font-medium mb-2">Get to know me</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              About Me
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-secondary">
                <Image
                  src={profile?.avatarUrl || "/placeholder.svg?height=500&width=500"}
                  alt={profile?.name || "Kunal Deshmukh"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-2xl -z-10" />
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {profile?.aboutHeading ||
                  `Full-Stack Developer based in ${profile?.location || "San Francisco"}`}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 text-pretty">
                {profile?.aboutParagraph1 ||
                  profile?.bio ||
                  "I&apos;m a passionate developer with expertise in building scalable web applications using the MERN stack. With over 5 years of experience, I&apos;ve worked with startups and enterprises to deliver high-quality solutions that drive business growth."}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">
                {profile?.aboutParagraph2 ||
                  "My approach combines clean code practices with modern design patterns to create applications that are not only functional but also maintainable and performant. I believe in continuous learning and staying updated with the latest technologies."}
              </p>

              <div className="grid grid-cols-3 gap-4">
                {highlights.map((item) => (
                  <Card key={item.label} className="bg-card border-border">
                    <CardContent className="p-4 text-center">
                      <item.icon className="h-6 w-6 text-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">
                        {item.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
