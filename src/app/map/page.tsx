"use client";

import GoogleMap from "@/features/map/components/map";
import { useFavorite } from "@/features/map/hooks/useFavorite";

const MyMap = () => {
    const { data: pinsData } = useFavorite();

    return <GoogleMap pinsData={pinsData} />;
};

export default MyMap;
