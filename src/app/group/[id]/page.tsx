"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import Label from "@/components/ui/Label/Label";
import GroupIcon from "@/features/groups/components/GroupIcon";
import GroupDialog from "@/features/groups/components/GroupDialog";
import styles from "@/features/groups/styles/pages/GroupEditPage.module.scss";
import InputField from "@/components/ui/InputField/InputField";
import { useUpdateGroup } from "@/features/groups/hooks/useUpdateGroup";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useGroupFromId } from "@/features/groups/hooks/useGroupFromId";
import { useEffect, useState } from "react";

const GroupEdit = () => {
    const params = useParams();
    const router = useRouter();

    const groupId = Number(params.id);

    const { data, error, isLoading } = useGroupFromId(groupId);
    const { mutate: updateGroup } = useUpdateGroup(groupId);

    const [name, setName] = useState<string>("");
    const [originalName, setOriginalName] = useState<string>("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openLeaveDialog, setOpenLeaveDialog] = useState<boolean>(false);

    useEffect(() => {
        if (data?.group.name) {
            setName(data.group.name);
            setOriginalName(data.group.name);
        }
    }, [data]);

    const handleDeleteGroup = () => {
        setOpenDeleteDialog(false);
    };

    const handleLeaveGroup = () => {
        setOpenLeaveDialog(false);
    };

    const handleEdited = () => {
        updateGroup(
            {
                name,
            },
            {
                onSuccess: () => {
                    console.log("グループ名を更新しました");
                    router.push("/group");
                },
                onError: (err) => {
                    alert(err.response?.data.error ?? "更新に失敗しました");
                },
            }
        );
    };

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error.response?.data.error}</p>;

    return (
        <>
            <div className={clsx("page_wrap", styles.pageWrap)}>
                <GroupHeader
                    text="グループ編集"
                    back
                    backToPage="/group"
                    btn={name !== originalName}
                    btnText="完了"
                    onClick={handleEdited}
                />
                <div className={styles.contentWrap}>
                    <GroupIcon
                        img={`${data?.group.icon_image_url}`}
                        label
                        edit={data?.myRole === "admin"}
                    />
                    <InputField
                        label="グループ名"
                        value={name}
                        onChange={setName}
                        reset={true}
                        edit={data?.myRole === "admin"}
                        space
                        className={styles.content}
                    />
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
                        className={clsx(styles.settingText, "text_normal bold")}
                        onClick={() => setOpenLeaveDialog(true)}
                    >
                        <p>グループを退会</p>
                    </button>
                    {data?.myRole === "admin" && (
                        <button
                            className={clsx(styles.settingText, "text_normal bold")}
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
