import styles from "@/features/map/styles/PinList.module.scss";
import { IoIosClose } from "react-icons/io";
import { Pin } from "../types/map";
import Image from "next/image";
import ScheduleButton from "./ScheduleButton";
import clsx from "clsx";
import {
    useJoinSchedule,
    useScheduleResponses,
    getUserResponse,
} from "@/features/map/hooks/useScheduleJoin";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

type PinListProps = {
    onClose: () => void;
    pins: Pin[];
};

const formatTime = (iso: string | null): string | undefined => {
    if (!iso) return undefined;
    const date = new Date(iso);
    return date.toISOString().slice(11, 16);
};

const PinList = ({ onClose, pins }: PinListProps) => {
    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
    const userId = currentUser?.user?.id;
    const queryClient = useQueryClient();
    const router = useRouter();
    const joinSchedule = useJoinSchedule();

    const handleJoin = async (scheduleId: number) => {
        await joinSchedule.mutateAsync(
            {
                schedule_id: scheduleId,
                response_type: "going",
            },
            {
                onSuccess: (data) => {
                    queryClient.invalidateQueries({
                        queryKey: ["schedule-responses", scheduleId],
                    });

                    if (data.chatRoom) {
                        router.push(`/chat/${data.chatRoom.uuid}`);
                    }
                },
            }
        );
    };

    return (
        <div className={styles.pinList}>
            <div className={styles.pinListHeader}>
                <div className={styles.space} />
                <h3 className="text_normal bold">現在の募集案件</h3>

                <button className={styles.close_btn} onClick={onClose}>
                    <IoIosClose size={30} />
                </button>
            </div>

            {pins.length === 0 && <p className={styles.empty}>この場所のピンはまだありません</p>}

            {pins.map((pin) => (
                <div key={pin.id} className={styles.pinItem}>
                    <p className="text_sub bold">{pin.user.username}</p>
                    <div className={styles.comment}>
                        <Image
                            src={pin.user.profile_image_url}
                            alt="ユーザーアイコン"
                            width={42}
                            height={42}
                            className={styles.avatar}
                        />
                        <div className={styles.speechWrap}>
                            <p className={clsx("text_sub", styles.speechBubble)}>
                                {pin.comment ?? "コメントなし"}
                            </p>
                        </div>
                    </div>

                    {pin.schedules.length === 0 && <p className="text_sub">スケジュール未設定</p>}

                    {pin.schedules.map((schedule) => {
                        // このスケジュールの参加状況を取得
                        const { data: responses = [] } = useScheduleResponses(schedule.id);
                        const userResponse =
                            userId !== undefined ? getUserResponse(responses, userId) : undefined;
                        const isAlreadyJoined = userResponse?.response_type === "going";

                        return (
                            <div key={schedule.id}>
                                <div className={styles.scheduleButtonWrap}>
                                    <ScheduleButton
                                        selectedDate={schedule.date}
                                        selectedStartTime={formatTime(schedule.start_at)}
                                        selectedEndTime={formatTime(schedule.end_at)}
                                    />
                                </div>

                                <div className={styles.participationBtnWrap}>
                                    <button
                                        className={clsx(
                                            styles.participationBtn,
                                            isAlreadyJoined && styles.participationBtnJoined
                                        )}
                                        onClick={() => handleJoin(schedule.id)}
                                        disabled={joinSchedule.isPending || isAlreadyJoined}
                                    >
                                        <p className="text_normal bold">
                                            {isAlreadyJoined
                                                ? "参加済み"
                                                : joinSchedule.isPending
                                                  ? "参加中..."
                                                  : "参加"}
                                        </p>
                                    </button>

                                    {/* {responses.length > 0 && (
                                        <p className={styles.participantCount}>
                                            {
                                                responses.filter((r) => r.response_type === "going")
                                                    .length
                                            }
                                            人が参加予定
                                        </p>
                                    )} */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default PinList;
