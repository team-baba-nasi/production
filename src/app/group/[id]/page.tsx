"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import Label from "@/components/ui/Label/Label";
import GroupIcon from "@/features/groups/components/GroupIcon";
import GroupDialog from "@/features/groups/components/GroupDialog";
import styles from "@/features/groups/styles/pages/GroupEditPage.module.scss";
import clsx from "clsx";
import { useState } from "react";

const GroupEdit = () => {
    const [changedName, setChangedName] = useState<string>("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openLeaveDialog, setOpenLeaveDialog] = useState<boolean>(false);

    const handleDeleteGroup = () => {
        setOpenDeleteDialog(false);
    };

    const handleLeaveGroup = () => {
        setOpenLeaveDialog(false);
    };

    const contents = {
        img: "/images/groups/test_icon.webp",
        name: "ババ抜きババ無し",
        members: ["a", "b", "c", "d"],
    };
    return (
        <>
            <div className={clsx("page_wrap", styles.pageWrap)}>
                <GroupHeader text="グループ編集" back backToPage="/group" />
                <div className={styles.contentWrap}>
                    <GroupIcon img={contents.img} label edit />
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
                    <button
                        className={clsx(styles.settingText, "text_xl")}
                        onClick={() => setOpenLeaveDialog(true)}
                    >
                        <p>グループを退会</p>
                    </button>
                    <button
                        className={clsx(styles.settingText, "text_xl")}
                        onClick={() => setOpenDeleteDialog(true)}
                    >
                        <p>グループを削除</p>
                    </button>
                </div>
            </div>
            {openDeleteDialog && (
                <GroupDialog
                    type="delete"
                    onClick={handleDeleteGroup}
                    onCancel={() => setOpenDeleteDialog(false)}
                    img={contents.img}
                    name={contents.name}
                />
            )}

            {openLeaveDialog && (
                <GroupDialog
                    type="leave"
                    onClick={handleLeaveGroup}
                    onCancel={() => setOpenLeaveDialog(false)}
                    img={contents.img}
                    name={contents.name}
                />
            )}
        </>
    );
};

export default GroupEdit;
