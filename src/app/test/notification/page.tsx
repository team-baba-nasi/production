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

            console.log("Service Worker registered:", registration);

            // 既存の購読を確認
            const existingSubscription = await registration.pushManager.getSubscription();
            setSubscription(existingSubscription);

            if (existingSubscription) {
                console.log("Existing subscription found");
            }
        } catch (error) {
            console.error("Service Worker registration failed:", error);
        }
    }

    async function subscribeToPush() {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;

            // 通知許可をリクエスト
            const permission = await Notification.requestPermission();

            if (permission !== "granted") {
                alert("通知の許可が必要です");
                return;
            }

            // プッシュ購読
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            });

            console.log("New subscription:", sub);
            setSubscription(sub);

            // サーバーに保存
            const response = await fetch("/api/notification/push-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sub),
            });

            if (response.ok) {
                alert("プッシュ通知の購読に成功しました！");
                fetchStats();
            } else {
                throw new Error("Failed to save subscription");
            }
        } catch (error) {
            console.error("Failed to subscribe:", error);
            alert("購読に失敗しました: " + error);
        } finally {
            setLoading(false);
        }
    }

    async function unsubscribeFromPush() {
        setLoading(true);
        try {
            if (subscription) {
                await subscription.unsubscribe();

                // サーバーから削除
                await fetch("/api/notification/push-subscription", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                });

                setSubscription(null);
                alert("購読を解除しました");
                fetchStats();
            }
        } catch (error) {
            console.error("Failed to unsubscribe:", error);
            alert("解除に失敗しました");
        } finally {
            setLoading(false);
        }
    }

    async function sendTestNotification() {
        if (!title.trim() || !message.trim()) {
            alert("タイトルとメッセージを入力してください");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/notification/send-notification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    body: message,
                    icon: "/icon-192x192.png",
                    url: "/",
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`通知を送信しました！\n成功: ${result.successful}/${result.total}`);
                setMessage("");
                setTitle("");
                fetchHistory();
            } else {
                alert("送信に失敗しました: " + result.error);
            }
        } catch (error) {
            console.error("Failed to send notification:", error);
            alert("エラーが発生しました");
        } finally {
            setLoading(false);
        }
    }
    async function fetchHistory() {
        try {
            const response = await fetch("/api/notification/notification-history");
            const data = await response.json();
            console.log("Notification history API response:", data);
            setHistory(data.notifications);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    }

    async function fetchStats() {
        try {
            const response = await fetch("/api/notification/push-subscription?limit=5");
            const data = await response.json();
            setStats({ total: data.count, count: data.count });
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    }

    function urlBase64ToUint8Array(base64String: string) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    if (!isSupported) {
        return (
            <main className="flex min-h-screen items-center justify-center p-8">
                <div className="max-w-md text-center bg-red-50 p-6 rounded-lg">
                    <h1 className="text-2xl font-bold mb-4 text-red-800">未対応</h1>
                    <p className="text-red-600">このブラウザはプッシュ通知に対応していません。</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* ヘッダー */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">PWA プッシュ通知</h1>
                    <p className="text-gray-600">Next.js + Prisma + PostgreSQL</p>
                </div>

                {/* 統計情報 */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">📊 統計情報</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">購読者数</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.count}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">あなたの状態</p>
                            <p className="text-lg font-semibold text-green-600">
                                {subscription ? "購読中 ✓" : "未購読"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 購読管理 */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">🔔 購読管理</h2>

                    {!subscription ? (
                        <button
                            onClick={subscribeToPush}
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                        >
                            {loading ? "処理中..." : "プッシュ通知を有効にする"}
                        </button>
                    ) : (
                        <button
                            onClick={unsubscribeFromPush}
                            disabled={loading}
                            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                        >
                            {loading ? "処理中..." : "購読を解除"}
                        </button>
                    )}
                </div>

                {/* 通知送信フォーム */}
                {subscription && (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">📨 通知を送信</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    タイトル
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="通知のタイトル"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    メッセージ
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="通知メッセージを入力..."
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={4}
                                />
                            </div>
                            <button
                                onClick={sendTestNotification}
                                disabled={loading}
                                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                            >
                                {loading ? "送信中..." : "全購読者に通知を送信"}
                            </button>
                        </div>
                    </div>
                )}

                {/* 送信履歴 */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">📜 送信履歴</h2>
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">まだ送信履歴がありません</p>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-800">
                                            {item.title}
                                        </h3>
                                        <span className="text-xs text-gray-500">
                                            {new Date(item.created_at).toLocaleString("ja-JP")}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{item.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 使い方 */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <h3 className="font-bold mb-3 text-gray-800">📖 使い方</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                        <li>「プッシュ通知を有効にする」をクリック</li>
                        <li>ブラウザの通知許可ダイアログで「許可」を選択</li>
                        <li>タイトルとメッセージを入力</li>
                        <li>「通知を送信」ボタンで全購読者に配信</li>
                    </ol>
                </div>
            </div>
        </main>
    );
}
