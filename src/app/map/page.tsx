"use client";

import GoogleMap from "@/features/map/components/map";
import { usePins } from "@/features/map/hooks/usePins";

const MyMap = () => {
    const { data: pinsData } = usePins({ scope: "mine" });

    return <GoogleMap pinsData={pinsData} />;
};

export default MyMap;
