"use client";

import { useGroupFromId } from "@/features/groups/hooks/useGroupFromId";
import GroupHeader from "@/features/groups/components/GroupHeader";
import clsx from "clsx";
import GroupIcon from "@/features/groups/components/GroupIcon";
import { useGroupId } from "@/features/groups/hooks/useGroupId";
import { useRouter } from "next/navigation";
import GroupMembers from "@/features/groups/components/GroupMembers";
import styles from "@/features/groups/styles/pages/GroupDetailsPage.module.scss";

const GroupDetails = () => {
    const router = useRouter();
    const groupId = useGroupId();
    const { data, error, isLoading } = useGroupFromId(groupId);

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error.response?.data.error}</p>;

    return (
        <>
            <div className={clsx("page_wrap", styles.pageWrap)}>
                <GroupHeader
                    text="グループ編集"
                    back
                    backToPage="/group"
                    btn={data?.myRole === "admin"}
                    btnText="編集"
                    onClick={() => router.push(`/group/${groupId}/edit`)}
                />
                <div className={styles.contentWrap}>
                    <GroupIcon
                        size={80}
                        img={`${data?.group.icon_image_url}`}
                        label
                        edit={data?.myRole === "admin"}
                    />

                    <GroupMembers data={data} groupId={groupId} />
                </div>
            </div>
        </>
    );
};

export default GroupDetails;
