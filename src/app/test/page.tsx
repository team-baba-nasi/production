"use client";

import { usePins } from "@/features/map/hooks/usePins";

const test = () => {
    const { data, isLoading, error } = usePins();

    if (isLoading) return <div>読み込み中...</div>;
    if (error) return <div>エラー: {error.response?.data.error}</div>;

    return (
        <div>
            {data?.pins.map((pin) => (
                <div key={pin.id}>
                    <p>{pin.latitude}</p>
                    <h3>{pin.place_name}</h3>
                    <p>{pin.comment}</p>
                    {pin.group && <span>グループ: {pin.group.name}</span>}
                </div>
            ))}
        </div>
    );
};

export default test;
