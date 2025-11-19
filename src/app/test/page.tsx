"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import List from "@/features/groups/components/List";
import InputField from "@/components/ui/InputField/InputField";
import { useState } from "react";
// import GroupDialog from "@/features/groups/components/GroupDialog";

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
            <List icon="test_icon" name="テストグループ" membersCount={5} />
            {/* <GroupDialog img={contents.img} type="delete" name="ババ抜きババ無し" /> */}
        </>
    );
};

export default test;
