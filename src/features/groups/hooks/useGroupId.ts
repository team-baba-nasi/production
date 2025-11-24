"use client";
import { useParams } from "next/navigation";

export function useGroupId() {
    const params = useParams();

    const id = params?.id;

    if (!id) return undefined;

    const groupId = Number(id);

    return isNaN(groupId) ? undefined : groupId;
}
