"use client";

import styles from "@/features/map/styles/CreatePin.module.scss";
import CreatePinButton from "./CreatePinBtn";
import Image from "next/image";
import ScheduleButton from "./ScheduleButton";
import { IoIosClose } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import { useGroups } from "@/features/groups/hooks/useGroups";
import clsx from "clsx";

type CreatePinSubmitPayload = {
    comment: string;
    groupIds: number[];
    schedule?: {
        date: string;
        startTime?: string;
        endTime?: string;
    };
};

type CreatePinProps = {
    onSubmit: (payload: CreatePinSubmitPayload) => void;
    onClose: () => void;
};

const CreatePin = ({ onSubmit, onClose }: CreatePinProps) => {
    const [commentText, setCommentText] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedStartTime, setSelectedStartTime] = useState<string>("");
    const [selectedEndTime, setSelectedEndTime] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const { data: groupsData } = useGroups();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        };

        if (showDatePicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDatePicker]);

    const handleCreatePin = () => {
        if (!commentText.trim()) return;
        if (selectedGroupIds.length === 0) return;

        onSubmit({
            comment: commentText,
            groupIds: selectedGroupIds,
            schedule: selectedDate
                ? {
                      date: selectedDate,
                      startTime: selectedStartTime || undefined,
                      endTime: selectedEndTime || undefined,
                  }
                : undefined,
        });

        setCommentText("");
    };

    const toggleGroup = (groupId: number) => {
        setSelectedGroupIds((prev) =>
            prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
        );
    };

    return (
        <div className={styles.createPinWrap}>
            <div className={styles.createPinHeader}>
                <div className={styles.space}></div>
                <h3 className="text_normal bold">いきたいピンを指す</h3>

                <button className={styles.close_btn} onClick={onClose}>
                    <IoIosClose size={30} />
                </button>
            </div>
            <div className={styles.comment_wrap}>
                <p className="text_sub">この店のPRをして一緒に行く友達を見つけよう</p>

                <input
                    type="text"
                    placeholder="一言入力"
                    value={commentText}
                    className="text_sub"
                    onChange={(e) => setCommentText(e.target.value)}
                />
            </div>
            <div className={styles.selectGroupWrap}>
                <p className="text_sub">どのグループに表示させる？</p>
                <div className={styles.selectGroup}>
                    {groupsData?.groups.map(({ group }) => {
                        const isSelected = selectedGroupIds.includes(group.id);

                        return (
                            <button
                                key={group.id}
                                type="button"
                                onClick={() => toggleGroup(group.id)}
                                className={styles.groupItem}
                            >
                                <div
                                    className={clsx(
                                        styles.groupImage,
                                        isSelected ? styles.selected : ""
                                    )}
                                >
                                    <Image
                                        src={
                                            group.icon_image_url ??
                                            "/images/common/group_default.png"
                                        }
                                        alt={group.name}
                                        width={58}
                                        height={58}
                                    />
                                </div>
                                <p className={clsx("text_sub_sub bold", styles.groupName)}>
                                    {group.name}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className={styles.scheduleButtonWrap}>
                <ScheduleButton
                    selectedDate={selectedDate}
                    selectedStartTime={selectedStartTime}
                    selectedEndTime={selectedEndTime}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                />
            </div>
            <p className={clsx("text_sub", styles.caution)}>
                予定日を過ぎると自動的にピンは削除されます
            </p>

            {showDatePicker && (
                <div className={styles.datePickerOverlay} onClick={() => setShowDatePicker(false)}>
                    <div
                        ref={datePickerRef}
                        className={styles.datePickerModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                        />
                        <div className={styles.timeRange}>
                            <input
                                type="time"
                                value={selectedStartTime}
                                onChange={(e) => setSelectedStartTime(e.target.value)}
                                placeholder="開始時間"
                            />
                            <span>~</span>
                            <input
                                type="time"
                                value={selectedEndTime}
                                onChange={(e) => setSelectedEndTime(e.target.value)}
                                placeholder="終了時間"
                            />
                        </div>
                        <button
                            onClick={() => setShowDatePicker(false)}
                            className={styles.datePickerConfirm}
                        >
                            決定
                        </button>
                    </div>
                </div>
            )}
            <div className={styles.createPinBtn}>
                <CreatePinButton onClick={handleCreatePin} />
            </div>
        </div>
    );
};

export default CreatePin;
