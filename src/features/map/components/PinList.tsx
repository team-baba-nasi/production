import styles from "@/features/map/styles/PinList.module.scss";
import { IoIosClose } from "react-icons/io";
import { Pin } from "../types/map";
import Image from "next/image";
import ScheduleButton from "./ScheduleButton";
import clsx from "clsx";

type PinListProps = {
    onClose: () => void;
    pins: Pin[];
};

const formatTime = (iso: string | null): string | undefined => {
    if (!iso) return undefined;
    const date = new Date(iso);
    return date.toISOString().slice(11, 16); // HH:mm
};

const PinList = ({ onClose, pins }: PinListProps) => {
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

                    {pin.schedules.map((schedule) => (
                        <div className={styles.scheduleButtonWrap} key={schedule.id}>
                            <ScheduleButton
                                key={schedule.id}
                                selectedDate={schedule.date}
                                selectedStartTime={formatTime(schedule.start_at)}
                                selectedEndTime={formatTime(schedule.end_at)}
                            />
                        </div>
                    ))}
                    <div className={styles.participationBtnWrap}>
                        <button className={styles.participationBtn}>
                            <p className="text_normal bold">参加</p>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PinList;
