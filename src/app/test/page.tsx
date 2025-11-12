"use client";

import WeekDayBtn from "@/features/map/components/WeekDayBtn";
import InputField from "@/components/ui/InputField/InputField";
import { useState } from "react";

const test = () => {
    const [gorupname, setGroupname] = useState<string>("");

    return (
        <>
            <WeekDayBtn active={true} week="月" day={22} />
            <WeekDayBtn active={false} week="火" day={23} />
            <InputField
                value={gorupname}
                onChange={setGroupname}
                placeholder="グループ名を入力"
                search={true}
            />
        </>
    );
};

export default test;
