"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import GroupIcon from "@/features/groups/components/GroupIcon";
import Label from "@/components/ui/Label/Label";
import InputField from "@/components/ui/InputField/InputField";
import SubmitBtn from "@/components/ui/SubmitBtn/SubmitBtn";
import { useState } from "react";
import { useCreateGroup } from "@/features/groups/hooks/useCreateGroup";
import { useRouter } from "next/navigation";
import styles from "@/features/groups/styles/pages/GroupCreatePage.module.scss";
import clsx from "clsx";

const GroupCreate = () => {
    const router = useRouter();
    const [groupName, setGroupname] = useState<string>("");
    const [groupIcon, setGroupIcon] = useState<string>("https://i.pravatar.cc/150?img=2");

    const { mutate } = useCreateGroup();

    const handleCreate = () => {
        mutate(
            { name: groupName, icon_image_url: groupIcon },
            {
                onSuccess: (data) => {
                    console.log("Group created:", data);
                    router.push(`/group/${data.group.id}/created`);
                },
                onError: (err) => {
                    console.error("Error:", err.response?.data);
                    alert("エラーが発生しました");
                },
            }
        );
    };

    return (
        <div className={clsx("page_wrap", styles.pageWrap)}>
            <GroupHeader text="グループ作成" />
            <GroupIcon img={groupIcon} label edit />
            <div className={styles.fieldWrap}>
                <Label label="グループ名" />
                <InputField
                    edit
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
