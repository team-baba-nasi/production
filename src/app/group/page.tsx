"use client";

import GroupHeader from "@/features/groups/components/GroupHeader";
import styles from "@/features/groups/styles/pages/GroupListPage.module.scss";
import InputField from "@/components/ui/InputField/InputField";
import Link from "next/link";
import clsx from "clsx";
import List from "@/features/groups/components/List";
import { useGroups } from "@/features/groups/hooks/useGroups";
import { useState } from "react";

const GroupList = () => {
    const [search, setSearchText] = useState<string>("");
    const { data, error, isLoading } = useGroups();

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error.response?.data.error}</p>;

    return (
        <div className={clsx("page_wrap", styles.pageWrap)}>
            <GroupHeader text="グループ管理" add addToPage="/group/create" />
            <InputField
                value={search}
                onChange={setSearchText}
                placeholder="グループ名を検索"
                search
                edit
            />
            {data ? (
                <ul>
                    {data?.groups.map((g) => (
                        <li key={g.group.id}>
                            <Link href={`/group/${g.group.id}`}>
                                <List name={g.group.name} membersCount={g.group.members.length} />
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>グループがありません</p>
            )}
        </div>
    );
};
export default GroupList;
