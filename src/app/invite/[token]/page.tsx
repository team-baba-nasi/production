import GroupDialog from "@/features/groups/components/GroupDialog";
import { useInviteGroup } from "@/features/groups/hooks/useInviteGroup";
import { useParams } from "next/navigation";

const GroupInvite = () => {
    const params = useParams();
    const token = params?.token as string | undefined;
    const { data, isLoading, error } = useInviteGroup(token);

    const handleJoin = () => {
        console.log("参加");
    };

    const cancelJoin = () => {
        console.log("閉じる");
    };

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error.response?.data.error}</p>;

    return (
        <>
            <GroupDialog
                name={`${data?.name}`}
                img={`${data?.icon}`}
                type="invite"
                onClick={handleJoin}
                onCancel={cancelJoin}
            />
        </>
    );
};

export default GroupInvite;
