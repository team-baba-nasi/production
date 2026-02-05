"use client";

import GoogleMap from "@/features/map/components/map";
import { usePins } from "@/features/map/hooks/usePins";
import { useGroupId } from "@/features/groups/hooks/useGroupId";

const GroupMap = () => {
    const groupId = useGroupId();

    const { data: pinsData, isError } = usePins({
        groupId: groupId ?? 0,
    });

    if (isError) {
        return null;
    }

    return <GoogleMap pinsData={pinsData} />;
};

export default GroupMap;
