"use client"

import { useEffect, useState } from "react"

interface HoneypotFieldProps {
  onBotDetected?: () => void
}

export function HoneypotField({ onBotDetected }: HoneypotFieldProps) {
  const [isBot, setIsBot] = useState(false)

  useEffect(() => {
    if (isBot && onBotDetected) {
      onBotDetected()
    }
  }, [isBot, onBotDetected])

  return (
    <div
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor="website_url">Website</label>
      <input
        type="text"
        id="website_url"
        name="website_url"
        autoComplete="off"
        tabIndex={-1}
        onChange={(e) => {
          if (e.target.value) {
            setIsBot(true)
          }
        }}
      />
    </div>
  )
}

export function checkHoneypot(formData: FormData): boolean {
  const honeypotValue = formData.get("website_url")
  return !!honeypotValue && honeypotValue.toString().length > 0
}
