"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import Group from "@/features/groups/components/Group";
import InputField from "@/components/ui/InputField/InputField";
import { useState } from "react";
// import GroupDialog from "@/features/groups/components/GroupDialog";

const test = () => {
    // const contents = {
    //     img: "/images/groups/test_icon.webp",
    //     name: "ババ抜きババ無し",
    //     members: ["a", "b", "c", "d"],
    // };
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
            <Group icon="test_icon" name="テストグループ" membersCount={5} />
            {/* <GroupDialog img={contents.img} type="delete" name="ババ抜きババ無し" /> */}
        </>
    );
};

export default test;
