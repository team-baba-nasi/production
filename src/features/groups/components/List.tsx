import Image from "next/image";
import styles from "@/features/groups/styles/Group.module.scss";

interface ListProps {
    icon?: string;
    name: string;
    membersCount: number;
}

const List: React.FC<ListProps> = ({ icon, name, membersCount }) => {
    return (
        <div className={styles.groupWrap}>
            <Image
                src={icon ? `/images/groups/${icon}.webp` : "/images/groups/test_icon.webp"}
                alt="groupIcon"
                width={56}
                height={56}
            />
            <p className="text_normal bold">
                {name}({membersCount})
            </p>
        </div>
    );
};

export default List;
