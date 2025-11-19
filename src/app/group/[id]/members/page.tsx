"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import Label from "@/components/ui/Label/Label";
import List from "@/features/groups/components/List";
import styles from "@/features/groups/styles/pages/GroupMembersPage.module.scss";
import GroupSettings from "@/features/groups/components/GroupSettings";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useGroupMembersFromId } from "@/features/groups/hooks/useGroupMembersFromId";

const GroupMembers = () => {
    const params = useParams();
    const groupId = Number(params.id);

    const { data, isLoading, error } = useGroupMembersFromId(groupId);

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
                            name={member.username}
                            icon={`${member.profile_image_url}`}
                            key={`${member.username}-${member.role}`}
                        />
                    ))}
                </div>
            </div>
            <GroupSettings
                groupId={groupId}
                role={`${data?.MyRole}`}
                icon_image_url={`${data?.group_icon}`}
                name={`${data?.group_name}`}
            />
        </div>
    );
};

export default GroupMembers;
