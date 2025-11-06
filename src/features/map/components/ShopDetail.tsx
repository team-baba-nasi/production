"use client";
import Image from "next/image";
import styles from "../styles/map.module.scss";

type ShopDetailProps = {
    place: google.maps.places.PlaceResult;
    onClose: () => void;
    isCreatePin: () => void;
};

const ShopDetail: React.FC<ShopDetailProps> = ({ place, onClose, isCreatePin }) => {
    return (
        <div className={styles.content}>
            {/* 店舗ヘッダー */}
            <div className={styles.shop_header}>
                <h3>{place.name}</h3>
                <div className={styles.header_buttons}>
                    <button className={styles.add_btn} onClick={isCreatePin}>
                        <span className={styles.addIcon}>○</span>追加
                    </button>
                    <button className={styles.close_btn} onClick={onClose}>
                        ×
                    </button>
                </div>
            </div>

            {/* 店舗情報 */}
            <div className={styles.info}>
                {place.rating && (
                    <p className={styles.rating}>
                        ★{place.rating}（{place.user_ratings_total}）
                    </p>
                )}

                {place.opening_hours?.weekday_text && (
                    <div className={styles.hours}>
                        <ul>
                            <li>営業時間：{place.opening_hours.weekday_text[0]}</li>
                        </ul>
                    </div>
                )}

                {place.vicinity && <p className={styles.vicinity}>{place.vicinity}</p>}
            </div>

            {/* 写真 */}
            {place.photos && (
                <Image
                    src={place.photos[0].getUrl({ maxWidth: 400 })}
                    alt={place.name ?? "restaurant photo"}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
            )}

            {/* レビュー */}
            {place.rating && (
                <p className={styles.rating_wrap}>
                    口コミ {place.user_ratings_total}件<span className={styles.rating_star}>★</span>
                </p>
            )}

            {place.reviews?.map((review) => (
                <div key={review.author_name} className={styles.review}>
                    <div className="flex gap-2">
                        <Image
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <p>
                            {review.author_name}
                            <span className="ml-2">{review.relative_time_description}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShopDetail;
