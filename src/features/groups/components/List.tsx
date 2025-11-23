import Image from "next/image";
import GroupDialog from "./GroupDialog";
import styles from "@/features/groups/styles/List.module.scss";
import { useState } from "react";

interface ListProps {
    icon: string;
    name: string;
    membersCount?: number;
    delete?: boolean;
    admin?: boolean;
}

const List: React.FC<ListProps> = ({ icon, name, membersCount, admin }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const handleDeleteMember = () => {
        console.log("object");
        setOpenDeleteDialog(false);
    };

    return (
        <>
            <div className={styles.groupWrap}>
                <div className={styles.details}>
                    <Image
                        src={icon ? `${icon}` : "/images/groups/test_icon.webp"}
                        alt="groupIcon"
                        width={56}
                        height={56}
                    />
                    <p className="text_normal bold">
                        {name}
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
                    img={icon}
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
