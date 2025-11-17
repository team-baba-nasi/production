"use client";

import styles from "@/features/groups/styles/GroupSettings.module.scss";
import clsx from "clsx";
import GroupDialog from "./GroupDialog";
import { useState } from "react";

interface GroupSettingsProps {
    role: string;
    icon_image_url: string;
    name: string;
}

const GroupSettings: React.FC<GroupSettingsProps> = ({ role, icon_image_url, name }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openLeaveDialog, setOpenLeaveDialog] = useState<boolean>(false);

    const handleDeleteGroup = () => {
        setOpenDeleteDialog(false);
    };

    const handleLeaveGroup = () => {
        setOpenLeaveDialog(false);
    };

    return (
        <>
            <div className={styles.groupSettings}>
                <button
                    className={clsx(styles.settingText, "text_normal bold")}
                    onClick={() => setOpenLeaveDialog(true)}
                >
                    <p>グループを退会</p>
                </button>
                {role === "admin" && (
                    <button
                        className={clsx(styles.settingText, "text_normal bold")}
                        onClick={() => setOpenDeleteDialog(true)}
                    >
                        <p>グループを削除</p>
                    </button>
                )}
            </div>
            {openDeleteDialog && (
                <GroupDialog
                    type="delete"
                    onClick={handleDeleteGroup}
                    onCancel={() => setOpenDeleteDialog(false)}
                    img={`${icon_image_url}`}
                    name={`${name}`}
                />
            )}

            {openLeaveDialog && (
                <GroupDialog
                    type="leave"
                    onClick={handleLeaveGroup}
                    onCancel={() => setOpenLeaveDialog(false)}
                    img={`${icon_image_url}`}
                    name={`${name}`}
                />
            )}
        </>
    );
};

export default GroupSettings;
