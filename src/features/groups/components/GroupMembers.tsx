import { GroupResponse } from "../types/group";
import Label from "@/components/ui/Label/Label";
import Image from "next/image";
import Link from "next/link";
import styles from "@/features/groups/styles/GroupMembers.module.scss";

interface GroupMembersProps {
    data: GroupResponse | undefined;
    groupId: number;
}

const GroupMembers: React.FC<GroupMembersProps> = ({ data, groupId }) => {
    return (
        <div className={styles.content}>
            <div className={styles.labelWrap}>
                <Label label={`メンバー(${data?.group.members.length})`} />
                <Link href={`/group/${groupId}/members`} className={styles.link}>
                    <p className="text_sub">一覧</p>
                    <Image src="/images/ui/arrow_right.svg" width={5} height={8} alt="右矢印" />
                </Link>
            </div>
            <div className={styles.memberWrap}>
                {data?.group.members.slice(0, 5).map((member) => {
                    return (
                        <div key={member.user_id} className={styles.member}>
                            <Image
                                src={`${member.user.profile_image_url}`}
                                alt="ユーザーアイコン"
                                width={58}
                                height={58}
                                className={styles.memberIcon}
                            />
                            {member.role === "admin" && <p>ホスト</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GroupMembers;
