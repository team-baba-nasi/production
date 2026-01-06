import styles from "@/features/map/styles/ScheduleButton.module.scss";

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
                <div className={styles.selectedText}>
                    <p>
                        {dateInfo.year}
                        <span>/</span>
                        {dateInfo.month}
                        <span>/</span>
                        {dateInfo.day}
                        <span>({dateInfo.weekday})</span>
                    </p>
                    {selectedStartTime && selectedEndTime && (
                        <p>
                            {selectedStartTime}~{selectedEndTime}
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
