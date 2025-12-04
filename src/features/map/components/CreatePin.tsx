"use client";

import styles from "@/features/map/styles/CreatePin.module.scss";
import { useState } from "react";

type CreatePinProps = {
    onSubmit: (comment: string) => void;
};

const CreatePin = ({ onSubmit }: CreatePinProps) => {
    const [commentText, setCommentText] = useState<string>("");

    const handleClick = () => {
        if (!commentText.trim()) return;
        onSubmit(commentText);
        setCommentText("");
    };

    return (
        <div className={styles.comment_wrap}>
            <p>この店のPRをして一緒に行く友達を見つけよう</p>
            <input
                type="text"
                placeholder="一言入力"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={handleClick}>ピンを登録</button>
        </div>
    );
};

export default CreatePin;
