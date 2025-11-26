"use client";

import GoogleMap from "@/features/map/components/map";
import { usePins } from "@/features/map/hooks/usePins";
import { useGroupId } from "@/features/groups/hooks/useGroupId";

const GroupMap = () => {
    const groupId = useGroupId();
    const { data: pinsData } = usePins({ groupId: groupId });

    return <GoogleMap pinsData={pinsData} />;
};

export default GroupMap;
