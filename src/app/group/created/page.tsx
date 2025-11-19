"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import GroupIcon from "@/features/groups/components/GroupIcon";
import SubmitBtn from "@/components/ui/SubmitBtn/SubmitBtn";
import clsx from "clsx";
import styles from "@/features/groups/styles/pages/GroupCreatedPage.module.scss";

const GroupCreate = () => {
    const handleCreate = () => {
        console.log("リンクをコピー");
    };
    const contents = {
        img: "/images/groups/test_icon.webp",
        name: "ババ抜きババ無し",
        members: ["a", "b", "c", "d"],
    };

    return (
        <div className={clsx("page_wrap", styles.pageWrap)}>
            <GroupHeader text="グループ作成完了！" />
            <div className={styles.groupInfoWrap}>
                <GroupIcon img={contents.img} />
                <p className={clsx(styles.groupText, "normal")}>ババ抜きババ無し</p>
            </div>
            <SubmitBtn text="リンクをコピー" onClick={handleCreate} link />
        </div>
    );
};

export default GroupCreate;
