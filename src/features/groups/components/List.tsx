import Image from "next/image";
import GroupDialog from "./GroupDialog";
import styles from "@/features/groups/styles/List.module.scss";
import { useState } from "react";

interface member {
    id: number;
    username: string;
    role: string;
    profile_image_url: string | null;
}
interface ListProps {
    member: member;
    addHost: boolean;
    membersCount?: number;
    delete?: boolean;
    admin?: boolean;
    onClick?: (id: number) => void;
}

const List: React.FC<ListProps> = ({ member, membersCount, admin, addHost, onClick }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const handleDeleteMember = () => {
        console.log("object");
        setOpenDeleteDialog(false);
    };

    return (
        <>
            <div className={styles.groupWrap}>
                <div className={styles.details}>
                    {member.role !== "admin" && addHost && (
                        <label className={styles.checkboxWrap}>
                            <input type="checkbox" onClick={() => onClick?.(member.id)} />
                            <span className={styles.customCheckbox}></span>
                        </label>
                    )}
                    <Image
                        src={
                            member.profile_image_url
                                ? `${member.profile_image_url}`
                                : "/images/groups/test_profile_image_url.webp"
                        }
                        alt="groupIcon"
                        width={56}
                        height={56}
                    />
                    <p className="text_normal bold">
                        {member.username}
                        {membersCount && `(${membersCount})`}
                    </p>
                </div>
                {admin && (
                    <button className="text_sub" onClick={() => setOpenDeleteDialog(true)}>
                        削除
                    </button>
                )}
            </div>
            {openDeleteDialog && (
                <GroupDialog
                    img={member.profile_image_url || ""}
                    onCancel={() => setOpenDeleteDialog(false)}
                    onClick={handleDeleteMember}
                    name={member.username}
                    type="kick"
                />
            )}
        </>
    );
};

export default List;
