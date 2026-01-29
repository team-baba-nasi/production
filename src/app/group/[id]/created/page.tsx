"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import GroupIcon from "@/features/groups/components/GroupIcon";
import SubmitBtn from "@/components/ui/SubmitBtn/SubmitBtn";
import clsx from "clsx";
import styles from "@/features/groups/styles/pages/GroupCreatedPage.module.scss";
import { useGroupId } from "@/features/groups/hooks/useGroupId";
import { useGroupFromId } from "@/features/groups/hooks/useGroupFromId";
import useGroupInviteURL from "@/features/groups/hooks/useGroupInviteURL";

const GroupCreate = () => {
    const groupId = Number(useGroupId());
    const copyURL = useGroupInviteURL();

    const { data, isLoading, error } = useGroupFromId(groupId);

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error.response?.data.error}</p>;

    return (
        <div className={clsx("page_wrap", styles.pageWrap)}>
            <GroupHeader text="グループ作成完了！" />
            <div className={styles.groupInfoWrap}>
                <GroupIcon img={`${data?.group.icon_image_url}`} size={100} />
                <p className={clsx(styles.groupText, "text_normal bold")}>ババ抜きババ無し</p>
            </div>
            <SubmitBtn text="リンクをコピー" onClick={copyURL} link />
        </div>
    );
};

export default GroupCreate;
