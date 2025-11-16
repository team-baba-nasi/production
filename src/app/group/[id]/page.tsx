"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import Label from "@/components/ui/Label/Label";
import GroupIcon from "@/features/groups/components/GroupIcon";
import GroupDialog from "@/features/groups/components/GroupDialog";
import styles from "@/features/groups/styles/pages/GroupEditPage.module.scss";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGroupFromId } from "@/features/groups/hooks/useGroupFromId";
import { useEffect, useState, useRef } from "react";

const GroupEdit = () => {
    const params = useParams();
    const groupId = Number(params.id);

    const { data, error, isLoading } = useGroupFromId(groupId);

    const groupNameInput = useRef<HTMLInputElement>(null);
    const [name, setName] = useState<string>("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openLeaveDialog, setOpenLeaveDialog] = useState<boolean>(false);

    useEffect(() => {
        setName(`${data?.group.name}`);
    }, [data]);

    const handleResetInput = () => {
        setName("");
        groupNameInput.current?.focus();
    };

    const handleDeleteGroup = () => {
        setOpenDeleteDialog(false);
    };

    const handleLeaveGroup = () => {
        setOpenLeaveDialog(false);
    };

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error.response?.data.error}</p>;

    return (
        <>
            <div className={clsx("page_wrap", styles.pageWrap)}>
                <GroupHeader text="グループ編集" back backToPage="/group" />
                <div className={styles.contentWrap}>
                    <GroupIcon img={`${data?.group.icon_image_url}`} label edit />
                    <div className={clsx(styles.content, styles.groupName)}>
                        <Label label="グループ名" />
                        <div className={styles.inputWrap}>
                            <input
                                ref={groupNameInput}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text_xl"
                            />
                            {name !== "" && (
                                <button onClick={handleResetInput} className={styles.close_btn}>
                                    <Image
                                        src="/images/ui/close_small.svg"
                                        alt="入力リセットボタン"
                                        width={20}
                                        height={20}
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.labelWrap}>
                            <Label label={`メンバー(${data?.group.members.length})`} />
                            <Link href={`/group/${groupId}/members`}>
                                <p>詳細</p>
                            </Link>
                        </div>
                        <div className={styles.memberWrap}>
                            {data?.group.members.slice(0, 5).map((member) => {
                                return (
                                    <div key={member.user_id} className={styles.member}>
                                        <Image
                                            src={`${member.user.profile_image_url}`}
                                            alt="ユーザーアイコン"
                                            width={58}
                                            height={58}
                                            className={styles.memberIcon}
                                        />
                                        {member.role === "admin" && <p>ホスト</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className={styles.groupSettings}>
                    <button
                        className={clsx(styles.settingText, "text_xl")}
                        onClick={() => setOpenLeaveDialog(true)}
                    >
                        <p>グループを退会</p>
                    </button>
                    {data?.myRole === "admin" && (
                        <button
                            className={clsx(styles.settingText, "text_xl")}
                            onClick={() => setOpenDeleteDialog(true)}
                        >
                            <p>グループを削除</p>
                        </button>
                    )}
                </div>
            </div>
            {openDeleteDialog && (
                <GroupDialog
                    type="delete"
                    onClick={handleDeleteGroup}
                    onCancel={() => setOpenDeleteDialog(false)}
                    img={`${data?.group.icon_image_url}`}
                    name={`${data?.group.name}`}
                />
            )}

            {openLeaveDialog && (
                <GroupDialog
                    type="leave"
                    onClick={handleLeaveGroup}
                    onCancel={() => setOpenLeaveDialog(false)}
                    img={`${data?.group.icon_image_url}`}
                    name={`${data?.group.name}`}
                />
            )}
        </>
    );
};

export default GroupEdit;
