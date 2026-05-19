"use client"

import { useState, useEffect } from "react"
import { Star, Trash2, ExternalLink, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Favorite {
  url: string
  label: string
  addedDate: string
  trustScore: number
  notes?: string
}

export function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [newNotes, setNewNotes] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("favorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const saveFavorites = (updated: Favorite[]) => {
    setFavorites(updated)
    localStorage.setItem("favorites", JSON.stringify(updated))
  }

  const addFavorite = () => {
    if (!newUrl.trim() || !newLabel.trim()) return

    const favorite: Favorite = {
      url: newUrl.trim(),
      label: newLabel.trim(),
      notes: newNotes.trim(),
      addedDate: new Date().toISOString().split("T")[0],
      trustScore: 100,
    }

    saveFavorites([...favorites, favorite])
    setNewUrl("")
    setNewLabel("")
    setNewNotes("")
  }

  const removeFavorite = (index: number) => {
    saveFavorites(favorites.filter((_, i) => i !== index))
  }

  const exportFavorites = () => {
    const data = JSON.stringify(favorites, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `safePi-favorites-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  return (
    <Card className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-hidden min-w-0">
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg md:text-xl font-bold text-foreground truncate">Trusted Sites</h2>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Save and manage your trusted websites</p>
          </div>
        </div>
        {favorites.length > 0 && (
          <Button onClick={exportFavorites} variant="outline" size="sm" className="shrink-0 bg-transparent">
            Export
          </Button>
        )}
      </div>

      <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Website URL"
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Label (e.g., Official Pi Wallet)"
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <textarea
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20"
        />
        <Button onClick={addFavorite} className="w-full" disabled={!newUrl.trim() || !newLabel.trim()}>
          <Star className="w-4 h-4 mr-2" />
          Add to Favorites
        </Button>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No favorites yet. Add your trusted sites above.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto overflow-x-hidden">
          {favorites.map((fav, index) => (
            <div key={index} className="p-4 rounded-lg bg-background border border-border space-y-2 min-w-0">
              <div className="flex items-start justify-between gap-3 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-success shrink-0" />
                    <h3 className="font-semibold text-foreground truncate">{fav.label}</h3>
                  </div>
                  <a
                    href={fav.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 break-all"
                  >
                    <span className="truncate">{fav.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  {fav.notes && <p className="text-xs text-muted-foreground mt-2 break-words">{fav.notes}</p>}
                  <p className="text-xs text-muted-foreground mt-2">Added: {fav.addedDate}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFavorite(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
