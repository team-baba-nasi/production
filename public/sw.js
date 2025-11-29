self.addEventListener("install", () => {
    console.log("Service Worker installing.");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activating.");
    event.waitUntil(clients.claim());
});

// プッシュ通知を受信したとき
self.addEventListener("push", (event) => {
    console.log("Push received:", event);

    if (event.data) {
        try {
            data = event.data.json();
        } catch {
            // JSON でない場合は text() を使う
            data = { body: event.data.text() };
        }
    }

    const title = data.title || "New Notification";
    const options = {
        body: data.body || "You have a new notification",
        icon: data.icon || "/icon-192x192.png",
        badge: "/icon-192x192.png",
        vibrate: [200, 100, 200],
        data: {
            url: data.url || "/",
            dateOfArrival: Date.now(),
        },
        actions: data.actions || [
            { action: "open", title: "開く" },
            { action: "close", title: "閉じる" },
        ],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// 通知をクリックしたとき
self.addEventListener("notificationclick", (event) => {
    console.log("Notification clicked:", event);

    event.notification.close();

    if (event.action === "close") {
        return;
    }

    const urlToOpen = event.notification.data.url || "/";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            // すでに開いているウィンドウがあればフォーカス
            for (const client of clientList) {
                if (client.url === urlToOpen && "focus" in client) {
                    return client.focus();
                }
            }
            // なければ新しいウィンドウを開く
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
