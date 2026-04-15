 "use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Database, Wrench } from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { Skill } from "@/lib/types"
const iconByCategory: Record<string, typeof Code> = {
  Frontend: Code,
  Backend: Database,
  Tools: Wrench,
}

export function SkillsSection() {
  const [skills, setSkills] = React.useState<Skill[]>([])

  React.useEffect(() => {
    let active = true
    apiFetch<{ data: Skill[] }>("/skills")
      .then((response) => {
        if (active) setSkills(response.data)
      })
      .catch(() => {
        if (active) setSkills([])
      })
    return () => {
      active = false
    }
  }, [])

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})

  const skillCategories = Object.entries(grouped).map(([title, values]) => ({
    title,
    icon: iconByCategory[title] || Wrench,
    skills: values,
  }))

  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent font-medium mb-2">What I work with</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Skills & Technologies
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {skillCategories.map((category) => (
              <Card
                key={category.title}
                className="bg-card border-border hover:border-accent/50 transition-colors"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <category.icon className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className="font-medium"
                        >
                          {skill.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
