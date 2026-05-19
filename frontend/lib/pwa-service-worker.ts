export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log("[v0] Service Worker registered:", registration.scope)

          // Check for updates every hour
          setInterval(() => {
            registration.update()
          }, 3600000)
        },
        (error) => {
          console.error("[v0] Service Worker registration failed:", error)
        },
      )
    })
  }
}

export async function requestNotificationPermission() {
  if (typeof window !== "undefined" && "Notification" in window) {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }
  return false
}

export function sendNotification(title: string, options?: NotificationOptions) {
  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      icon: "/icon-192.png",
      badge: "/icon-72.png",
      ...options,
    })
  }
}
