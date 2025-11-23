import Image from "next/image";
import GroupDialog from "./GroupDialog";
import styles from "@/features/groups/styles/List.module.scss";
import { useState } from "react";
import { useRemoveGroupMember } from "../hooks/useRemoveGroupMember";
import { useGroupId } from "../hooks/useGroupId";

interface ListProps {
    id?: number;
    name: string;
    role?: string;
    icon: string;
    addHost?: boolean;
    membersCount?: number;
    admin?: boolean;
    onClick?: (id: number) => void;
}

const List: React.FC<ListProps> = ({
    id,
    name,
    role,
    icon,
    membersCount,
    admin,
    addHost,
    onClick,
}) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const groupId = useGroupId();

    const { mutate: removeMember } = useRemoveGroupMember(groupId);

    const handleDeleteMember = (targetUserId: number | undefined) => {
        if (!targetUserId) return;
        if (!groupId) return console.error("グループIDが無効です");

        removeMember(targetUserId, {
            onSuccess: () => setOpenDeleteDialog(false),
            onError: (e) => console.error(e.response?.data),
        });
    };
    return (
        <>
            <div className={styles.groupWrap}>
                <div className={styles.details}>
                    {role !== "admin" && addHost && id && (
                        <label className={styles.checkboxWrap}>
                            <input type="checkbox" onChange={() => id && onClick?.(id)} />
                            <span className={styles.customCheckbox}></span>
                        </label>
                    )}

                    <Image
                        src={icon || "/images/groups/test_profile_image_url.webp"}
                        alt="groupIcon"
                        width={56}
                        height={56}
                    />

                    <p className="text_normal bold">
                        {name}
                        {role && ` (${role})`}
                        {membersCount && ` (${membersCount})`}
                    </p>
                </div>

                {admin && id && (
                    <button className="text_sub" onClick={() => setOpenDeleteDialog(true)}>
                        削除
                    </button>
                )}
            </div>

            {openDeleteDialog && id && (
                <GroupDialog
                    img={icon}
                    onCancel={() => setOpenDeleteDialog(false)}
                    onClick={() => handleDeleteMember(id)}
                    name={name}
                    type="kick"
                />
            )}
        </>
    );
};

export default List;
