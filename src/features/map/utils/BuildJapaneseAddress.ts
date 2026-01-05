type JapaneseAddress = {
    postalCode?: string;
    address: string;
};

const buildJapaneseAddress = (place: google.maps.places.PlaceResult): JapaneseAddress => {
    const components = place.address_components ?? [];

    const find = (type: string): string | undefined =>
        components.find((c) => c.types.includes(type))?.long_name;

    const postalCode = find("postal_code");

    const prefecture = find("administrative_area_level_1");
    const city = find("locality") ?? find("administrative_area_level_2");
    const town = find("sublocality_level_1");
    const street = find("route");

    const address = [prefecture, city, town, street].filter(Boolean).join("");

    return {
        postalCode,
        address,
    };
};

export default buildJapaneseAddress;
