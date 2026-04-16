"use client"

import * as React from "react"
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { AdminPageLoader } from "@/components/admin/admin-page-loader"
import { useToast } from "@/hooks/use-toast"
import { apiFetch } from "@/lib/api"
import type { Skill } from "@/lib/types"

const categories = ["Frontend", "Backend", "Tools"]

export default function SkillsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(true)
  const [skills, setSkills] = React.useState<Skill[]>([])
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingSkillId, setEditingSkillId] = React.useState<number | null>(null)
  const [newSkill, setNewSkill] = React.useState({
    name: "",
    category: "Frontend",
    level: 80,
  })

  const loadSkills = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await apiFetch<{ data: Skill[] }>("/admin/skills")
      setSkills(response.data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadSkills().catch(() => {
      toast({
        title: "Failed to load skills",
        description: "Please refresh the page.",
        variant: "destructive",
      })
    })
  }, [loadSkills, toast])

  const resetForm = () => {
    setNewSkill({ name: "", category: "Frontend", level: 80 })
    setEditingSkillId(null)
  }

  const handleSaveSkill = () => {
    if (!newSkill.name.trim()) return

    if (editingSkillId !== null) {
      apiFetch<{ data: Skill }>(`/admin/skills/${editingSkillId}`, {
        method: "PATCH",
        body: newSkill,
      })
        .then((response) => {
          setSkills(
            skills.map((skill) =>
              skill.id === editingSkillId ? response.data : skill
            )
          )
          setDialogOpen(false)
          resetForm()
          toast({
            title: "Skill updated",
            description: `${response.data.name} has been updated.`,
          })
        })
        .catch((err) => {
          toast({
            title: "Failed to update skill",
            description: err instanceof Error ? err.message : "Please try again.",
            variant: "destructive",
          })
        })
      return
    }

    apiFetch<{ data: Skill }>("/admin/skills", {
      method: "POST",
      body: newSkill,
    })
      .then((response) => {
        setSkills([...skills, response.data])
        setDialogOpen(false)
        resetForm()
        toast({
          title: "Skill added",
          description: `${response.data.name} has been added to your skills.`,
        })
      })
      .catch((err) => {
        toast({
          title: "Failed to add skill",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        })
      })
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkillId(skill.id)
    setNewSkill({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    apiFetch<{ success: boolean }>(`/admin/skills/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setSkills(skills.filter((s) => s.id !== id))
        toast({
          title: "Skill deleted",
          description: "The skill has been removed from your portfolio.",
        })
      })
      .catch((err) => {
        toast({
          title: "Failed to delete skill",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        })
      })
  }

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>
  )

  if (isLoading) {
    return (
      <AdminPageLoader
        title="Loading skills"
        description="Fetching your technical skill set..."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Skills</h1>
          <p className="text-muted-foreground mt-1">
            Manage your technical skills
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkillId !== null ? "Edit Skill" : "Add New Skill"}
              </DialogTitle>
              <DialogDescription>
                {editingSkillId !== null
                  ? "Update this skill in your portfolio."
                  : "Add a new skill to your portfolio."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Skill Name</label>
                <Input
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                  placeholder="e.g., React, Python, Docker"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newSkill.category}
                  onValueChange={(value) =>
                    setNewSkill({ ...newSkill, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Proficiency Level: {newSkill.level}%
                </label>
                <Slider
                  value={[newSkill.level]}
                  onValueChange={([value]) =>
                    setNewSkill({ ...newSkill, level: value })
                  }
                  max={100}
                  step={1}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveSkill}>
                {editingSkillId !== null ? "Save Changes" : "Add Skill"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <Card key={category} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category}
                <Badge variant="secondary" className="ml-2">
                  {groupedSkills[category]?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {groupedSkills[category]?.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">
                          {skill.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(skill)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(skill.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
                {(!groupedSkills[category] ||
                  groupedSkills[category].length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No skills in this category yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
