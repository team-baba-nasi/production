"use client";

import GroupDialog from "@/features/groups/components/GroupDialog";
import { useInviteGroup } from "@/features/groups/hooks/useInviteGroup";
import { useJoinGroup } from "@/features/groups/hooks/useJoinGroup";
import { useParams, useRouter } from "next/navigation";

const GroupInvite = () => {
    const params = useParams();
    const router = useRouter();
    const joinGroup = useJoinGroup();
    const token = params?.token as string;
    const { data, isLoading, error } = useInviteGroup(token);

    const handleJoin = async () => {
        joinGroup.mutate(
            { token },
            {
                onSuccess: (res) => {
                    router.push(`/group/${res.groupId}`);
                },
                onError: () => {
                    alert("参加に失敗しました。");
                },
            }
        );
    };

    const cancelJoin = () => {
        router.push(`/groups`);
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
