"use client";

import { useState } from "react";
import styles from "@/features/groups/styles/GroupSettings.module.scss";
import clsx from "clsx";
import GroupDialog from "./GroupDialog";
import { useArchiveGroup } from "../hooks/useDeleateGroup";
import { useRouter } from "next/navigation";
import { useRemoveGroupMember } from "../hooks/useRemoveGroupMember";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

interface GroupSettingsProps {
    role: string;
    icon_image_url: string;
    name: string;
    groupId: number;
}

const GroupSettings: React.FC<GroupSettingsProps> = ({ role, icon_image_url, name, groupId }) => {
    const router = useRouter();

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openLeaveDialog, setOpenLeaveDialog] = useState<boolean>(false);
    const { data: currentUser } = useCurrentUser();
    const { mutate: removeMember } = useRemoveGroupMember(groupId);
    const { mutate: archiveGroup } = useArchiveGroup(groupId);

    const handleDeleteGroup = () => {
        archiveGroup(undefined, {
            onSuccess: (data) => {
                console.log("アーカイブ成功:", data);
                setOpenDeleteDialog(false);
                router.push("/group");
            },
            onError: (err) => {
                console.error("エラー:", err.response?.data.error);
            },
        });
    };

    const handleLeaveGroup = () => {
        if (!currentUser?.user) return;
        removeMember(currentUser.user.id);
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
