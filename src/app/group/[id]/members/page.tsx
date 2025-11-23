"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import Label from "@/components/ui/Label/Label";
import List from "@/features/groups/components/List";
import styles from "@/features/groups/styles/pages/GroupMembersPage.module.scss";
import clsx from "clsx";
import SubmitBtn from "@/components/ui/SubmitBtn/SubmitBtn";
import { useGroupId } from "@/features/groups/hooks/useGroupId";
import { useGroupMembersFromId } from "@/features/groups/hooks/useGroupMembersFromId";
import { useState } from "react";

const GroupMembers = () => {
    const groupId = useGroupId();

    const { data, isLoading, error } = useGroupMembersFromId(groupId);

    const [addHost, setAddHost] = useState<boolean>(false);
    const [selectedAddHost, setSelectedAddHost] = useState<number[]>([]);

    const handleSelectAddHost = (id: number) => {
        setSelectedAddHost((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error.response?.data.error}</p>;

    return (
        <div className={clsx("page_wrap", styles.memberListWrap)}>
            <div>
                <GroupHeader text="メンバー一覧" back backToPage={`/group/${groupId}`} />

                <div className={styles.label_wrap}>
                    <Label label={`メンバー(${data?.members.length})`} />
                </div>
                <div className={styles.members_wrap}>
                    {data?.members?.map((member) => (
                        <List
                            addHost={addHost && member.username !== data.myName}
                            member={member}
                            key={`${member.id}-${member.role}`}
                            admin={data.myRole === "admin" && member.username !== data.myName}
                            onClick={handleSelectAddHost}
                        />
                    ))}
                </div>
            </div>
            {data?.myRole === "admin" && (
                <SubmitBtn
                    text={!addHost ? "ホスト権限を与える" : "完了"}
                    onClick={() => setAddHost((prev) => !prev)}
                />
            )}
        </div>
    );
};

export default GroupMembers;
