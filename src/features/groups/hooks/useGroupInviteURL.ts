import { useCreateInviteToken } from "./useCreateInviteToken";
import { useGroupId } from "./useGroupId";

const useGroupInviteURL = () => {
    const groupId = useGroupId();
    const createInvite = useCreateInviteToken();

    const copyURL = () => {
        createInvite.mutate(
            { groupId },
            {
                onSuccess: async (data) => {
                    try {
                        await navigator.clipboard.writeText(data.inviteUrl);
                        alert("招待URLをコピーしました！");
                    } catch {
                        alert(
                            "URLのコピーに失敗しました…手動でコピーしてください。\n" +
                                data.inviteUrl
                        );
                    }
                },
                onError: (err) => {
                    alert(err.response?.data?.error ?? "エラーが発生しました");
                },
            }
        );
    };

    return copyURL;
};

export default useGroupInviteURL;
