import styles from "@/features/map/styles/ScheduleButton.module.scss";
import clsx from "clsx";
import Image from "next/image";

type ScheduleButtonProps = {
    selectedDate: string;
    selectedStartTime: string;
    selectedEndTime: string;
    onClick: () => void;
};

const ScheduleButton = ({
    selectedDate,
    selectedStartTime,
    selectedEndTime,
    onClick,
}: ScheduleButtonProps) => {
    const getDateInfo = (dateString: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            weekday: weekdays[date.getDay()],
        };
    };

    const dateInfo = getDateInfo(selectedDate);

    return (
        <button className={styles.selectSchedule} onClick={onClick}>
            {dateInfo ? (
                <div className={clsx(styles.selectedText, "text_title")}>
                    <div className={styles.dateWrap}>
                        <p className={styles.date}>
                            {dateInfo.year}
                            <span className="text_sub bold">/</span>
                            {dateInfo.month}
                            <span className="text_sub bold">/</span>
                            {dateInfo.day}
                            {/* <span>({dateInfo.weekday})</span> */}
                        </p>
                        <div className={styles.weekDayWrap}>
                            <Image
                                src="/images/chat/eclipse.svg"
                                alt="曜日の背景の円"
                                width={24}
                                height={24}
                            />
                            <p className={clsx(styles.weekDay, "text_normal bold")}>
                                {dateInfo.weekday}
                            </p>
                        </div>
                    </div>
                    {selectedStartTime && selectedEndTime && (
                        <p className="text_normal bold">
                            {selectedStartTime} ~ {selectedEndTime}
                        </p>
                    )}
                    {selectedStartTime && !selectedEndTime && <p>{selectedStartTime}~</p>}
                </div>
            ) : (
                <p className="text_normal">※スケジュールを選択してください</p>
            )}
        </button>
    );
};

export default ScheduleButton;
