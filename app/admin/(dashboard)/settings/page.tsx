"use client"

import * as React from "react"
import Image from "next/image"
import { Camera, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { apiFetch } from "@/lib/api"
import type { NotificationSettings, Profile } from "@/lib/types"

export default function SettingsPage() {
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const [profile, setProfile] = React.useState<Profile>({
    name: "Kunal Deshmukh",
    title: "MERN Stack Developer",
    email: "hello@johndoe.dev",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "I build exceptional digital experiences with modern web technologies. Passionate about creating clean, efficient, and user-friendly applications.",
    aboutHeading: "Full-Stack Developer based in San Francisco",
    aboutParagraph1:
      "I'm a passionate developer with expertise in building scalable web applications using the MERN stack. With over 5 years of experience, I've worked with startups and enterprises to deliver high-quality solutions that drive business growth.",
    aboutParagraph2:
      "My approach combines clean code practices with modern design patterns to create applications that are not only functional but also maintainable and performant. I believe in continuous learning and staying updated with the latest technologies.",
    highlights: {
      yearsExperience: "5+",
      projectsCompleted: "50+",
      happyClients: "30+",
    },
    social: {
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "",
    },
  })

  const [notifications, setNotifications] = React.useState<NotificationSettings>({
    emailNotifications: true,
    newMessages: true,
    weeklyReport: false,
  })

  React.useEffect(() => {
    apiFetch<{ data: { profile: Profile; notifications: NotificationSettings } }>(
      "/admin/settings"
    )
      .then((response) => {
        setProfile(response.data.profile)
        setNotifications(response.data.notifications)
      })
      .catch(() => {
        toast({
          title: "Failed to load settings",
          description: "Please refresh the page.",
          variant: "destructive",
        })
      })
  }, [toast])

  const handleSave = async () => {
    await apiFetch<{ success: boolean }>("/admin/settings", {
      method: "PUT",
      body: { profile, notifications },
    })
    toast({
      title: "Settings saved",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsUploadingImage(true)
    const formData = new FormData()
    formData.append("image", file)
    try {
      const response = await apiFetch<{ success: boolean; data: { url: string } }>(
        "/admin/upload/profile-image",
        {
          method: "POST",
          body: formData,
        }
      )
      setProfile((prev) => ({ ...prev, avatarUrl: response.data.url }))
      toast({
        title: "Image uploaded",
        description: "Profile image has been updated.",
      })
    } catch (err) {
      toast({
        title: "Image upload failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
      event.target.value = ""
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your portfolio settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information displayed on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary">
                <Image
                  src={profile.avatarUrl || "/placeholder.svg?height=96&width=96"}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageUpload}
              />
            </div>
            <div>
              <p className="font-medium text-foreground">Profile Photo</p>
              <p className="text-sm text-muted-foreground">
                JPG, GIF or PNG. Max size 2MB. {isUploadingImage ? "Uploading..." : ""}
              </p>
            </div>
          </div>

          <Separator />

          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={profile.title}
                onChange={(e) =>
                  setProfile({ ...profile, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>About Section</CardTitle>
          <CardDescription>
            Manage content displayed in your portfolio About section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">About Heading</label>
            <Input
              value={profile.aboutHeading || ""}
              onChange={(e) =>
                setProfile({ ...profile, aboutHeading: e.target.value })
              }
              placeholder="Full-Stack Developer based in San Francisco"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">About Paragraph 1</label>
            <Textarea
              value={profile.aboutParagraph1 || ""}
              onChange={(e) =>
                setProfile({ ...profile, aboutParagraph1: e.target.value })
              }
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">About Paragraph 2</label>
            <Textarea
              value={profile.aboutParagraph2 || ""}
              onChange={(e) =>
                setProfile({ ...profile, aboutParagraph2: e.target.value })
              }
              rows={4}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Years Experience</label>
              <Input
                value={profile.highlights?.yearsExperience || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    highlights: {
                      ...(profile.highlights || {}),
                      yearsExperience: e.target.value,
                    },
                  })
                }
                placeholder="5+"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Projects Completed</label>
              <Input
                value={profile.highlights?.projectsCompleted || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    highlights: {
                      ...(profile.highlights || {}),
                      projectsCompleted: e.target.value,
                    },
                  })
                }
                placeholder="50+"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Happy Clients</label>
              <Input
                value={profile.highlights?.happyClients || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    highlights: {
                      ...(profile.highlights || {}),
                      happyClients: e.target.value,
                    },
                  })
                }
                placeholder="30+"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>
            Connect your social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub</label>
            <Input
              value={profile.social.github}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  social: { ...profile.social, github: e.target.value },
                })
              }
              placeholder="https://github.com/username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn</label>
            <Input
              value={profile.social.linkedin}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  social: { ...profile.social, linkedin: e.target.value },
                })
              }
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for important updates
              </p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailNotifications: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">New Messages</p>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive a new contact message
              </p>
            </div>
            <Switch
              checked={notifications.newMessages}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, newMessages: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Weekly Report</p>
              <p className="text-sm text-muted-foreground">
                Receive weekly analytics report for your portfolio
              </p>
            </div>
            <Switch
              checked={notifications.weeklyReport}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, weeklyReport: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
