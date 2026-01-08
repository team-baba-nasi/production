import { useState, useRef, useEffect } from "react";
import styles from "@/features/map/styles/MapHeader.module.scss";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineMenu } from "react-icons/md";
import Image from "next/image";
import { useGroups } from "@/features/groups/hooks/useGroups";

type MapHeaderProps = {
    onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
    mapInstance?: google.maps.Map | null;
};

const MapHeader = ({ onPlaceSelect, mapInstance }: MapHeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [showPredictions, setShowPredictions] = useState(false);

    const { data: groups, isLoading, isError } = useGroups();
    const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Google Maps APIが読み込まれているかチェック
    useEffect(() => {
        const initializeServices = () => {
            if (typeof window !== "undefined" && window.google?.maps?.places) {
                if (!autocompleteServiceRef.current) {
                    autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
                }
                if (mapInstance && !placesServiceRef.current) {
                    placesServiceRef.current = new google.maps.places.PlacesService(mapInstance);
                }
            }
        };

        initializeServices();

        // Google Maps APIの読み込みを待つ
        const checkInterval = setInterval(() => {
            if (window.google?.maps?.places) {
                initializeServices();
                clearInterval(checkInterval);
            }
        }, 100);

        return () => clearInterval(checkInterval);
    }, [mapInstance]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value.trim() === "") {
            setPredictions([]);
            setShowPredictions(false);
            return;
        }

        // AutocompleteServiceが初期化されているか確認
        if (!autocompleteServiceRef.current) {
            console.warn("AutocompleteService is not initialized yet");
            return;
        }

        try {
            autocompleteServiceRef.current.getPlacePredictions(
                {
                    input: value,
                    componentRestrictions: { country: "jp" },
                    types: ["restaurant", "cafe", "bar", "food"],
                },
                (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        setPredictions(results);
                        setShowPredictions(true);
                    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                        setPredictions([]);
                        setShowPredictions(false);
                    } else {
                        console.warn("Places API error:", status);
                        setPredictions([]);
                        setShowPredictions(false);
                    }
                }
            );
        } catch (error) {
            console.error("Error fetching predictions:", error);
        }
    };

    const handlePredictionClick = (placeId: string) => {
        // PlacesServiceが初期化されていない場合、mapInstanceから再初期化を試みる
        if (!placesServiceRef.current && mapInstance) {
            placesServiceRef.current = new google.maps.places.PlacesService(mapInstance);
        }

        // それでも初期化できない場合、一時的なdiv要素を使用
        if (!placesServiceRef.current) {
            const div = document.createElement("div");
            placesServiceRef.current = new google.maps.places.PlacesService(div);
        }

        if (!placesServiceRef.current) {
            console.warn("PlacesService could not be initialized");
            return;
        }

        placesServiceRef.current.getDetails(
            {
                placeId: placeId,
                fields: [
                    "name",
                    "place_id",
                    "geometry",
                    "formatted_address",
                    "vicinity",
                    "types",
                    "rating",
                    "user_ratings_total",
                    "photos",
                    "opening_hours",
                    "website",
                    "formatted_phone_number",
                ],
            },
            (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    setSearchValue(place.name || "");
                    setShowPredictions(false);
                    setPredictions([]);

                    if (place.geometry?.location && mapInstance) {
                        mapInstance.panTo(place.geometry.location);
                        setTimeout(() => {
                            mapInstance.setZoom(17);
                        }, 200);
                    }

                    if (onPlaceSelect) {
                        onPlaceSelect(place);
                    }
                }
            }
        );
    };

    const handleSearchFocus = () => {
        if (predictions.length > 0) {
            setShowPredictions(true);
        }
    };

    const handleSearchBlur = () => {
        setTimeout(() => {
            setShowPredictions(false);
        }, 200);
    };

    if (isLoading) {
        return <p>ロード中</p>;
    }

    if (isError || !groups) {
        return <p>エラーが発生しました</p>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.groupButton} onClick={() => setIsOpen(!isOpen)}>
                    <HiUserGroup size={30} color="black" />
                </button>

                <div className={styles.searchWrapper}>
                    <div className={styles.searchContainer}>
                        <Image
                            src="/images/ui/search.svg"
                            alt="search"
                            width={18}
                            height={18}
                            className={styles.search}
                        />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="検索する"
                            className={styles.searchInput}
                            value={searchValue}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                        />
                    </div>

                    {showPredictions && predictions.length > 0 && (
                        <div className={styles.predictionsDropdown}>
                            {predictions.map((prediction) => (
                                <button
                                    key={prediction.place_id}
                                    className={styles.predictionItem}
                                    onClick={() => handlePredictionClick(prediction.place_id)}
                                >
                                    <div className={styles.predictionIcon}>
                                        <Image
                                            src="/images/ui/search.svg"
                                            alt="place"
                                            width={16}
                                            height={16}
                                        />
                                    </div>
                                    <div className={styles.predictionText}>
                                        <div className={styles.predictionMain}>
                                            {prediction.structured_formatting.main_text}
                                        </div>
                                        <div className={styles.predictionSecondary}>
                                            {prediction.structured_formatting.secondary_text}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button className={styles.menuButton}>
                    <MdOutlineMenu size={30} color="black" />
                </button>
            </header>

            <div className={`${styles.dropdown} ${isOpen ? styles.open : ""}`}>
                {groups.groups.map((g, index) => (
                    <button
                        key={g.group.id}
                        className={`${styles.groupItem} ${index === 0 ? styles.active : ""}`}
                    >
                        {g.group.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MapHeader;
