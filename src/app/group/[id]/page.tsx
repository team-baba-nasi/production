"use client";

import { useRouter } from "next/navigation";
import { useGroupFromId } from "@/features/groups/hooks/useGroupFromId";
import { useGroupId } from "@/features/groups/hooks/useGroupId";
import GroupSettings from "@/features/groups/components/GroupSettings";
import clsx from "clsx";
import GroupHeader from "@/features/groups/components/GroupHeader";
import GroupIcon from "@/features/groups/components/GroupIcon";
import GroupMembers from "@/features/groups/components/GroupMembers";
import styles from "@/features/groups/styles/pages/GroupDetailsPage.module.scss";
import SubmitBtn from "@/components/ui/SubmitBtn/SubmitBtn";
import useGroupInviteURL from "@/features/groups/hooks/useGroupInviteURL";

const GroupDetails = () => {
    const router = useRouter();
    const groupId = useGroupId();
    const copyURL = useGroupInviteURL();
    const { data, error, isLoading } = useGroupFromId(groupId);

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error.response?.data.error}</p>;

    return (
        <>
            <div className={clsx("page_wrap", styles.pageWrap)}>
                <div>
                    <GroupHeader
                        back
                        backToPage="/group"
                        btn={data?.myRole === "admin"}
                        btnText="編集"
                        onClick={() => router.push(`/group/${groupId}/edit`)}
                    />
                    <div className={styles.contentWrap}>
                        <GroupIcon size={100} img={`${data?.group.icon_image_url}`} />
                        <h3 className="text_normal">{data?.group.name}</h3>

                        <div className={styles.membersWrap}>
                            <GroupMembers data={data} groupId={groupId} />
                        </div>
                    </div>
                </div>
                <div
                    className={clsx(
                        styles.groupSettings,
                        data?.myRole === "admin" ? styles.admin : styles.member
                    )}
                >
                    <SubmitBtn text="リンクをコピー" onClick={copyURL} link />
                    {data?.myRole !== "admin" && (
                        <GroupSettings
                            role={`${data?.myRole}`}
                            icon_image_url={`${data?.group.icon_image_url}`}
                            name={`${data?.group.name}`}
                            groupId={groupId}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default GroupDetails;
