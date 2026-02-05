type JapaneseAddress = {
    postalCode?: string;
    address: string;
};

const buildJapaneseAddress = (place: google.maps.places.PlaceResult): JapaneseAddress => {
    if (!place.address_components) {
        return {
            postalCode: undefined,
            address: place.formatted_address?.replace(/^日本、\s?/, "") ?? "",
        };
    }

    const components = place.address_components;

    const find = (type: string): string | undefined =>
        components.find((c) => c.types.includes(type))?.long_name;

    const postalCode = find("postal_code");

    const prefecture = find("administrative_area_level_1");
    const city = find("locality") ?? find("administrative_area_level_2");

    const town = find("sublocality_level_1");

    // 日本特有
    const chome = find("sublocality_level_2"); // ○丁目
    const ban = find("sublocality_level_3"); // ○番
    const go = find("street_number") ?? find("premise"); // ○号

    const addressParts = [
        prefecture,
        city,
        town,
        chome ? `${chome}` : undefined,
        ban ? `${ban}` : undefined,
        go ? `${go}` : undefined,
    ];

    const address = addressParts.filter(Boolean).join("");

    return {
        postalCode,
        address,
    };
};

export default buildJapaneseAddress;
