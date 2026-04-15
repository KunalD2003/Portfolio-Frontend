"use client"

import * as React from "react"
import { Mail, MailOpen, MoreHorizontal, Trash2, Reply, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"
import type { Message } from "@/lib/types"

export default function MessagesPage() {
  const { toast } = useToast()
  const [messages, setMessages] = React.useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const loadMessages = React.useCallback(async () => {
    const response = await apiFetch<{ data: Message[] }>("/admin/messages")
    setMessages(response.data)
  }, [])

  React.useEffect(() => {
    loadMessages().catch(() => {
      toast({
        title: "Failed to load messages",
        description: "Please refresh the page.",
        variant: "destructive",
      })
    })
  }, [loadMessages, toast])

  const unreadCount = messages.filter((m) => m.unread).length

  const handleOpenMessage = (message: Message) => {
    setSelectedMessage(message)
    setDialogOpen(true)
    if (message.unread) {
      apiFetch<{ data: Message }>(`/admin/messages/${message.id}`, {
        method: "PATCH",
        body: { unread: false },
      }).catch(() => undefined)
      setMessages(messages.map((m) => (m.id === message.id ? { ...m, unread: false } : m)))
    }
  }

  const handleDelete = (id: number) => {
    apiFetch<{ success: boolean }>(`/admin/messages/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setMessages(messages.filter((m) => m.id !== id))
        toast({
          title: "Message deleted",
          description: "The message has been removed.",
        })
      })
      .catch((err) => {
        toast({
          title: "Failed to delete message",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        })
      })
  }

  const handleMarkAsRead = (id: number) => {
    apiFetch<{ data: Message }>(`/admin/messages/${id}`, {
      method: "PATCH",
      body: { unread: false },
    }).catch(() => undefined)
    setMessages(messages.map((m) => (m.id === id ? { ...m, unread: false } : m)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Contact form submissions from your portfolio
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="text-sm">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>From</TableHead>
                <TableHead className="hidden md:table-cell">Subject</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow
                  key={message.id}
                  className={cn(
                    "cursor-pointer",
                    message.unread && "bg-secondary/30"
                  )}
                  onClick={() => handleOpenMessage(message)}
                >
                  <TableCell>
                    {message.unread ? (
                      <Mail className="h-4 w-4 text-accent" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p
                        className={cn(
                          "text-foreground",
                          message.unread && "font-semibold"
                        )}
                      >
                        {message.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {message.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p
                      className={cn(
                        "truncate max-w-xs",
                        message.unread
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {message.subject}
                    </p>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {new Date(message.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Reply className="h-4 w-4 mr-2" />
                          Reply
                        </DropdownMenuItem>
                        {message.unread && (
                          <DropdownMenuItem
                            onClick={() => handleMarkAsRead(message.id)}
                          >
                            <MailOpen className="h-4 w-4 mr-2" />
                            Mark as read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(message.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  From {selectedMessage.name} ({selectedMessage.email})
                  <br />
                  {new Date(selectedMessage.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-foreground leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
