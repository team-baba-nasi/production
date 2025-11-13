"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import Label from "@/components/ui/Label/Label";
import styles from "@/features/groups/styles/GroupPage.module.scss";
import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";

const GroupEdit = () => {
    const [changedName, setChangedName] = useState<string>("");
    const contents = {
        img: "/images/groups/test_icon.png",
        name: "ババ抜きババ無し",
        members: ["a", "b", "c", "d"],
    };
    return (
        <div className={clsx("page_wrap", styles.pageWrap)}>
            <GroupHeader text="グループ編集" back backToPage="/group" />
            <div className={styles.contentWrap}>
                <div className={styles.content}>
                    <Label label="グループ画像" />
                    <div className={styles.iconWrap}>
                        <Image
                            src={contents.img}
                            alt="グループアイコン"
                            width={80}
                            height={80}
                            className={styles.groupIcon}
                        />
                        <Image
                            src="/images/groups/camera.svg"
                            alt="カメラアイコン"
                            width={24}
                            height={24}
                            className={styles.cameraIcon}
                        />
                    </div>
                </div>
                <div className={clsx(styles.content, styles.groupName)}>
                    <Label label="グループ名" />
                    <input
                        type="text"
                        value={contents.name}
                        onChange={(e) => setChangedName(e.target.value)}
                        className="text_xl"
                    />
                </div>
                <div className={styles.content}>
                    <Label label={`メンバー(${contents.members.length})`} />
                </div>
            </div>
            <div className={styles.groupSettings}>
                <p className={clsx(styles.settingText, "text_xl")}>グループを退会</p>
                <p className={clsx(styles.settingText, "text_xl")}>グループを削除</p>
            </div>
        </div>
    );
};

export default GroupEdit;
