"use client";

import { useChatGroup } from "@/features/chat/hooks/useChatGroup";
import Navigation from "@/components/ui/Navigation/Navigation";
import InputField from "@/components/ui/InputField/InputField";
import styles from "@/features/chat/styles/pages/chatList.module.scss";
import ChatGroup from "@/features/chat/components/ChatGroup";
import { useState } from "react";

const Home = () => {
    const { data, isLoading, isError, error } = useChatGroup();
    const [searchGroupName, setSearchGroupName] = useState<string>("");
    console.log(data);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (isError) {
        return <div className="text-red-500">{error.response?.data.error}</div>;
    }

    if (!data || data.chatGroups.length === 0) {
        return <div>チャットはありません</div>;
    }

    return (
        <div className={styles.pageWrap}>
            <div className={styles.content}>
                <h2 className="text-title">チャット</h2>
                <Navigation />
                <InputField
                    placeholder="グループ名を検索"
                    search
                    edit
                    value={searchGroupName}
                    onChange={setSearchGroupName}
                />
                <ul>
                    {data.chatGroups.map((item) => {
                        const room = item.chat_room;
                        const lastMessage = room.messages?.[0] ?? null;

                        return (
                            <li key={room.uuid}>
                                <ChatGroup room={room} lastMessage={lastMessage} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Home;
