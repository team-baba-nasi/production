"use client";
import Image from "next/image";
import styles from "../styles/ShopDetil.module.scss";
import { IoIosClose } from "react-icons/io";

type ShopDetailProps = {
    place: google.maps.places.PlaceResult;
    onClose: () => void;
};

const ShopDetail: React.FC<ShopDetailProps> = ({ place, onClose }) => {
    return (
        <div className={styles.content}>
            {/* 店舗ヘッダー */}
            <div className={styles.shop_header}>
                <h3>{place.name}</h3>
                <div className={styles.header_buttons}>
                    <button className={styles.close_btn} onClick={onClose}>
                        <IoIosClose size={30} />
                    </button>
                </div>
            </div>

            {/* 店舗情報 */}
            <div className={styles.info}>
                {place.rating && (
                    <p className={styles.rating}>
                        ★{place.rating}（{place.user_ratings_total}件）
                    </p>
                )}

                {place.vicinity && <p className={styles.vicinity}>{place.vicinity}</p>}

                {place.opening_hours?.weekday_text && (
                    <div className={styles.hours}>
                        <p className={styles.hours_title}>営業時間</p>
                        <ul>
                            {place.opening_hours.weekday_text.map((text, index) => (
                                <li key={index}>{text}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* 店舗写真 */}
            {place.photos && place.photos.length > 0 && (
                <div className={styles.photo_container}>
                    <Image
                        src={place.photos[0].getUrl({ maxWidth: 600 })}
                        alt={place.name ?? "restaurant photo"}
                        width={600}
                        height={400}
                        className={styles.shop_photo}
                    />
                </div>
            )}

            {/* レビューセクション */}
            {place.reviews && place.reviews.length > 0 && (
                <div className={styles.reviews_section}>
                    <h4 className={styles.reviews_title}>
                        口コミ {place.user_ratings_total}件
                        {place.rating && (
                            <span className={styles.rating_star}>★{place.rating}</span>
                        )}
                    </h4>

                    <div className={styles.reviews_list}>
                        {place.reviews.map((review, index) => (
                            <div key={`${review.author_name}-${index}`} className={styles.review}>
                                <div className={styles.review_header}>
                                    <Image
                                        src={review.profile_photo_url}
                                        alt={review.author_name}
                                        width={40}
                                        height={40}
                                        className={styles.profile_photo}
                                    />
                                    <div className={styles.review_meta}>
                                        <p className={styles.author_name}>{review.author_name}</p>
                                        <p className={styles.review_time}>
                                            {review.relative_time_description}
                                        </p>
                                    </div>
                                </div>

                                {review.rating && (
                                    <div className={styles.review_rating}>
                                        {"★".repeat(review.rating)}
                                        {"☆".repeat(5 - review.rating)}
                                    </div>
                                )}

                                {review.text && <p className={styles.review_text}>{review.text}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopDetail;
