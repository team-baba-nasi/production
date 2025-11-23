import Image from "next/image";
import GroupDialog from "./GroupDialog";
import styles from "@/features/groups/styles/List.module.scss";
import { useState } from "react";

interface ListProps {
    id?: number;
    name: string;
    role?: string;
    icon: string;
    addHost?: boolean;
    membersCount?: number;
    delete?: boolean;
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
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const handleDeleteMember = () => {
        console.log("object");
        setOpenDeleteDialog(false);
    };

    return (
        <>
            <div className={styles.groupWrap}>
                <div className={styles.details}>
                    {role !== "admin" && addHost && id && (
                        <label className={styles.checkboxWrap}>
                            <input type="checkbox" onClick={() => onClick?.(id)} />
                            <span className={styles.customCheckbox}></span>
                        </label>
                    )}
                    <Image
                        src={icon ? `${icon}` : "/images/groups/test_profile_image_url.webp"}
                        alt="groupIcon"
                        width={56}
                        height={56}
                    />
                    <p className="text_normal bold">
                        {name}
                        {role}
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
                    img={icon || ""}
                    onCancel={() => setOpenDeleteDialog(false)}
                    onClick={handleDeleteMember}
                    name={name}
                    type="kick"
                />
            )}
        </>
    );
};

export default List;
