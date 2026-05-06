"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface JoinLinkCopyProps {
  joinLink: string
}

export function JoinLinkCopy({ joinLink }: JoinLinkCopyProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(joinLink)
    toast.success("Link copied to clipboard!")
  }

  return (
    <div className="flex gap-2">
      <Input
        id="join-link"
        readOnly
        value={joinLink}
        className="flex-1 font-mono text-sm"
        onClick={(e) => (e.target as HTMLInputElement).select()}
      />
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  )
}
