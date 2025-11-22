"use client";

import { useParams } from "next/navigation";

export const useGroupId = () => {
    const params = useParams();
    const id = Number(params.id);

    if (Number.isNaN(id)) {
        throw new Error("Invalid group id");
    }

    return id;
};
