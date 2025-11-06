"use client";

import styles from "@/features/map/styles/WeekDayBtn.module.scss";
import { useState } from "react";
import clsx from "clsx";

type WeekDayBtnProps = {
    active: boolean;
    week: string;
    day: number;
};

const WeekDayBtn = ({ active, week, day }: WeekDayBtnProps) => {
    const [selected, setSelected] = useState<boolean>(false);

    const handleClick = () => {
        if (active) {
            setSelected((prev) => !prev);
        }
    };

    return (
        <button
            className={clsx(
                styles.btn_wrap,
                selected && styles.selected,
                !active && styles.noneActive
            )}
            onClick={handleClick}
        >
            <p>{week}</p>
            <p>{day}</p>
            {!active && <p>定休</p>}
        </button>
    );
};

export default WeekDayBtn;
