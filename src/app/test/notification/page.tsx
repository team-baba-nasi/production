"use client";

import { useState, useEffect } from "react";

interface NotificationHistory {
    id: number;
    title: string;
    message: string;
    created_at: string;
    user: {
        id: number;
        username: string;
    };
}

export default function Home() {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<NotificationHistory[]>([]);
    const [stats, setStats] = useState({ total: 0, count: 0 });

    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);
            registerServiceWorker();
            fetchHistory();
            fetchStats();
        }
    }, []);

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register("/sw.js", {
                scope: "/",
                updateViaCache: "none",
            });

            const existingSubscription = await registration.pushManager.getSubscription();
            setSubscription(existingSubscription);
        } catch (error) {
            console.error(error);
        }
    }

    async function subscribeToPush() {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                alert("通知許可が必要です");
                return;
            }

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            });

            setSubscription(sub);

            await fetch("/api/notification/push-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sub),
            });

            fetchStats();
        } catch (error) {
            alert("購読に失敗");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function unsubscribeFromPush() {
        setLoading(true);
        try {
            if (subscription) {
                await subscription.unsubscribe();

                await fetch("/api/notification/push-subscription", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                });

                setSubscription(null);
                fetchStats();
            }
        } catch (error) {
            alert(`解除失敗${error}`);
        } finally {
            setLoading(false);
        }
    }

    async function sendTestNotification() {
        if (!title.trim() || !message.trim()) {
            alert("タイトルとメッセージが必要");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/notification/send-notification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    body: message,
                    icon: "/icon-192x192.png",
                    url: "/",
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(`送信成功 ${result.successful}/${result.total}`);
                setMessage("");
                setTitle("");
                fetchHistory();
            } else {
                alert("送信失敗");
            }
        } catch (err) {
            alert(`エラー:${err}`);
        } finally {
            setLoading(false);
        }
    }

    async function fetchHistory() {
        try {
            const res = await fetch("/api/notification/notification-history");
            const data = await res.json();
            setHistory(data.notifications);
        } catch {
            console.error("history error");
        }
    }

    async function fetchStats() {
        try {
            const res = await fetch("/api/notification/push-subscription?limit=5");
            const data = await res.json();
            setStats({ total: data.count, count: data.count });
        } catch {
            console.error("stats error");
        }
    }

    function urlBase64ToUint8Array(base64String: string) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; i++) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    if (!isSupported) {
        return <div className="p-4 text-center">プッシュ通知非対応</div>;
    }

    return (
        <div className="p-4 space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">PWA Push</h1>

            <div className="border p-3">
                <p>購読者数: {stats.count}</p>
                <p>状態: {subscription ? "購読中" : "未購読"}</p>
            </div>

            <div className="border p-3 space-y-2">
                {!subscription ? (
                    <button
                        onClick={subscribeToPush}
                        disabled={loading}
                        className="border px-3 py-2"
                    >
                        {loading ? "処理中..." : "購読する"}
                    </button>
                ) : (
                    <button
                        onClick={unsubscribeFromPush}
                        disabled={loading}
                        className="border px-3 py-2"
                    >
                        {loading ? "処理中..." : "購読解除"}
                    </button>
                )}
            </div>

            {subscription && (
                <div className="border p-3 space-y-2">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="タイトル"
                        className="border p-2 w-full"
                    />
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="メッセージ"
                        className="border p-2 w-full"
                        rows={3}
                    />
                    <button
                        onClick={sendTestNotification}
                        disabled={loading}
                        className="border px-3 py-2"
                    >
                        {loading ? "送信中..." : "通知送信"}
                    </button>
                </div>
            )}

            <div className="border p-3">
                <h2 className="font-bold mb-2">履歴</h2>
                {history.length === 0 ? (
                    <p>なし</p>
                ) : (
                    <div className="space-y-2">
                        {history.map((h) => (
                            <div key={h.id} className="border p-2">
                                <div className="flex justify-between">
                                    <span>{h.title}</span>
                                    <span className="text-xs">
                                        {new Date(h.created_at).toLocaleString("ja-JP")}
                                    </span>
                                </div>
                                <p className="text-sm">{h.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
