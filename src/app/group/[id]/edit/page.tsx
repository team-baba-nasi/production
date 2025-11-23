"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import GroupMembers from "@/features/groups/components/GroupMembers";
import GroupIcon from "@/features/groups/components/GroupIcon";
import styles from "@/features/groups/styles/pages/GroupEditPage.module.scss";
import InputField from "@/components/ui/InputField/InputField";
import GroupSettings from "@/features/groups/components/GroupSettings";
import { useUpdateGroup } from "@/features/groups/hooks/useUpdateGroup";
import clsx from "clsx";
import { useGroupId } from "@/features/groups/hooks/useGroupId";
import { useRouter } from "next/navigation";
import { useGroupFromId } from "@/features/groups/hooks/useGroupFromId";
import { useEffect, useState } from "react";

const GroupEdit = () => {
    const router = useRouter();

    const groupId = useGroupId();
    if (!groupId) {
        console.error("グループIDが無効です");
        return;
    }

    const { data, error, isLoading } = useGroupFromId(groupId);
    const { mutate: updateGroup } = useUpdateGroup(groupId);

    const [name, setName] = useState<string>("");
    const [originalName, setOriginalName] = useState<string>("");

    useEffect(() => {
        if (data?.group.name) {
            setName(data.group.name);
            setOriginalName(data.group.name);
        }
    }, [data]);

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
                        size={80}
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
                    <GroupMembers groupId={groupId} data={data} />

                    <GroupSettings
                        groupId={groupId}
                        role={`${data?.myRole}`}
                        name={`${data?.group.name}`}
                        icon_image_url={`${data?.group.icon_image_url}`}
                    />
                </div>
            </div>
        </>
    );
};

export default GroupEdit;
