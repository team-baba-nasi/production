"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import GroupIcon from "@/features/groups/components/GroupIcon";
import SubmitBtn from "@/components/ui/SubmitBtn/SubmitBtn";
import clsx from "clsx";
import styles from "@/features/groups/styles/pages/GroupCreatedPage.module.scss";
import { useGroupFromId } from "@/features/groups/hooks/useGroupFromId";
import { useParams } from "next/navigation";

const GroupCreate = () => {
    const params = useParams();
    const groupId = Number(params.id);

    const { data, isLoading, error } = useGroupFromId(groupId);

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error.response?.data.error}</p>;

    const handleCopyURL = () => {
        console.log("リンクをコピー");
    };

    return (
        <div className={clsx("page_wrap", styles.pageWrap)}>
            <GroupHeader text="グループ作成完了！" />
            <div className={styles.groupInfoWrap}>
                <GroupIcon img={`${data?.group.icon_image_url}`} />
                <p className={clsx(styles.groupText, "normal")}>ババ抜きババ無し</p>
            </div>
            <SubmitBtn text="リンクをコピー" onClick={handleCopyURL} link />
        </div>
    );
};

export default GroupCreate;
