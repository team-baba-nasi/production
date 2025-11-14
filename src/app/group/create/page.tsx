"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import GroupIcon from "@/features/groups/components/GroupIcon";
import Label from "@/components/ui/Label/Label";
import InputField from "@/components/ui/InputField/InputField";
import SubmitBtn from "@/components/ui/SubmitBtn/SubmitBtn";
import { useState } from "react";
import styles from "@/features/groups/styles/pages/GroupCreatePage.module.scss";
import clsx from "clsx";

const GroupCreate = () => {
    const handleCreate = () => {
        console.log("グループ作成");
    };
    const contents = {
        img: "/images/groups/test_icon.png",
        name: "ババ抜きババ無し",
        members: ["a", "b", "c", "d"],
    };
    const [groupName, setGroupname] = useState<string>("");

    return (
        <div className={clsx("page_wrap", styles.pageWrap)}>
            <GroupHeader text="グループ作成" />
            <GroupIcon img={contents.img} label edit />
            <div className={styles.fieldWrap}>
                <Label label="グループ名" />
                <InputField
                    value={groupName}
                    onChange={setGroupname}
                    placeholder="グループ名を入力"
                />
            </div>
            <SubmitBtn text="作成" onClick={handleCreate} />
        </div>
    );
};

export default GroupCreate;
