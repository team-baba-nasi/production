"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import InputField from "@/components/ui/InputField/InputField";
import { useState } from "react";

const test = () => {
    const [gorupname, setGroupname] = useState<string>("");

    return (
        <>
            <InputField
                value={gorupname}
                onChange={setGroupname}
                placeholder="グループ名を入力"
                search={true}
            />
            <GroupHeader text="グループ管理" add addToPage="/" />
            <GroupHeader text="グループ編集" back backToPage="/" />
            <GroupHeader text="グループ作成" />
        </>
    );
};

export default test;
