"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import styles from "@/features/groups/styles/pages/GroupListPage.module.scss";
import InputField from "@/components/ui/InputField/InputField";
import clsx from "clsx";
import Group from "@/features/groups/components/Group";
import { useState } from "react";

const GroupList = () => {
    const [search, setSearchText] = useState<string>("");

    return (
        <div className={clsx("page_wrap", styles.pageWrap)}>
            <GroupHeader text="グループ管理" add addToPage="/group/create" />
            <InputField
                value={search}
                onChange={setSearchText}
                placeholder="グループ名を検索"
                search
            />
            <Group icon="test_icon" name="テストグループ" membersCount={5} />
            <Group icon="test_icon" name="テストグループ" membersCount={5} />
        </div>
    );
};
export default GroupList;
