"use client";

import Navigation from "@/components/ui/Navigation/Navigation";
import InputField from "@/components/ui/InputField/InputField";
import styles from "@/features/chat/styles/pages/chatList.module.scss";
import ChatGroup from "@/features/chat/components/ChatGroup";
import { useState } from "react";

const Home = () => {
    const [searchGroupName, setSearchGroupName] = useState<string>("");

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
                <ChatGroup />
                <ChatGroup />
                <ChatGroup />
                <ChatGroup />
            </div>
        </div>
    );
};

export default Home;
