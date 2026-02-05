"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./Lp.module.scss";
import Image from "next/image";
import LpBtn from "../components/ui/LpBtn/LpBtn";

export default function Home() {
    const [activeSection, setActiveSection] = useState<string>("top");
    const mainRef = useRef<HTMLDivElement>(null);
    const [isAboutVisible, setIsAboutVisible] = useState(false);

    useEffect(() => {
        const mainElement = mainRef.current;
        if (!mainElement) return;

        const handleScroll = () => {
            const sections = [
                { id: "top", element: document.getElementById("top") },
                { id: "about", element: document.getElementById("about") },
                { id: "video", element: document.getElementById("video") },
                { id: "features", element: document.getElementById("features") },
                { id: "howto", element: document.getElementById("howto") },
                { id: "start", element: document.getElementById("start") },
            ];

            const scrollPosition = mainElement.scrollTop;
            const viewportHeight = mainElement.clientHeight;
            const middlePosition = scrollPosition + viewportHeight / 2;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.element) {
                    const sectionTop = section.element.offsetTop;
                    if (sectionTop <= middlePosition) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        handleScroll(); // 初回実行
        mainElement.addEventListener("scroll", handleScroll);
        return () => mainElement.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const aboutSection = document.getElementById("about");
        if (!aboutSection) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsAboutVisible(true);
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(aboutSection);
        return () => observer.disconnect();
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        const mainElement = mainRef.current;
        if (element && mainElement) {
            const offsetTop = element.offsetTop;
            mainElement.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });
        }
    };

    const navItems = [
        { id: "top", label: "TOP" },
        { id: "about", label: "たべごろとは?" },
        { id: "video", label: "紹介動画" },
        { id: "features", label: "機能" },
        { id: "howto", label: "使い方" },
        { id: "start", label: "今すぐ使う" },
    ];

    return (
        <div className={styles.container}>
            <aside className={styles.leftSide}>
                <nav className={styles.nav} aria-label="ページナビゲーション">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    type="button"
                                    className={activeSection === item.id ? styles.active : ""}
                                    onClick={() => scrollToSection(item.id)}
                                    aria-current={
                                        activeSection === item.id ? "location" : undefined
                                    }
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <main className={styles.main} ref={mainRef}>
                <div className={styles.scrollAreaWrapper}>
                    <div className={styles.scrollArea}>
                        <section id="top" className={styles.mainVisualWrap}>
                            <Image
                                src="/images/logo.svg"
                                alt="たべごろのロゴ"
                                width={100}
                                height={133}
                                className={styles.logo}
                            />
                            <div className={styles.mainVisual}>
                                <h1>
                                    <Image
                                        src="/images/lp/h1_ttl.png"
                                        alt=""
                                        width={600}
                                        height={150}
                                        aria-hidden="true"
                                    />
                                </h1>
                                <Image
                                    src="/images/lp/mockup_top.png"
                                    alt="アプリ画面のモックアップ画像"
                                    width={600}
                                    height={600}
                                    className={styles.mockUp}
                                />
                            </div>
                        </section>
                        <section id="about" className={styles.catchCopyWrap}>
                            <h2 className={isAboutVisible ? styles.fadeInUp : ""}>
                                SNSで見つけた、あの美味しそうなお店。
                                <br />
                                保存したまま、行かずに終わっていませんか？
                            </h2>
                            <div className={styles.catchCopyItems}>
                                <div
                                    className={`${styles.catchCopyItem} ${styles.catchCopyItemFirst} ${isAboutVisible ? styles.fadeInUp : ""}`}
                                >
                                    <p>
                                        このお店めっちゃ美味しそう!
                                        <br />
                                        保存しとこ~♪
                                    </p>
                                    <Image
                                        src="/images/lp/sns_like.png"
                                        alt="snsでいいねをしている女性のイラスト画像"
                                        width={300}
                                        height={300}
                                    />
                                </div>
                                <div
                                    className={`${styles.catchCopyItem} ${styles.catchCopyItemSecond} ${isAboutVisible ? styles.fadeInUp : ""}`}
                                >
                                    <p>保存するだけしといて結局行けてないな...</p>
                                    <Image
                                        src="/images/lp/worried.png"
                                        alt="snsでいいねをしている女性のイラスト画像"
                                        width={300}
                                        height={300}
                                    />
                                </div>
                            </div>
                            <Image
                                src="/images/lp/character/scroll_icon.svg"
                                alt="スクロールアイコン"
                                width={100}
                                height={100}
                                className={`${styles.scrollAnimation} ${isAboutVisible ? styles.fadeInUp : ""}`}
                            />
                        </section>
                        <section id="video" className={styles.introduceWrap}>
                            <h2 className={styles.introduceTtlWrap}>
                                <span className={styles.introduceTtlTop}>
                                    <Image
                                        src="/images/logo.svg"
                                        alt="たべごろ"
                                        width={80}
                                        height={106}
                                    />
                                    は、
                                </span>
                                <span>
                                    気になる飲食店の「行きたい」を友達と共有して、
                                    <br />
                                    実際に行けるアプリです
                                </span>
                            </h2>
                            <div className={styles.youtubeWrap}>
                                <iframe
                                    src="https://www.youtube.com/embed/3o_wuix1nWY?si=y_1W2qZdb2ZUlcNS"
                                    title="たべごろ紹介動画"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                    className={styles.youtubeIframe}
                                ></iframe>
                            </div>
                        </section>
                        <section id="features" className={styles.featuresWrap}>
                            <h2 className="sr-only">機能紹介</h2>
                            <Image
                                src="/images/lp/character/features_line.svg"
                                alt=""
                                width={600}
                                height={100}
                                className={styles.featuresLine}
                                aria-hidden="true"
                            />
                            <div className={styles.featuresList}>
                                <article className={styles.features}>
                                    <h3 className={styles.featuresTitle}>機能1</h3>
                                    <div className={styles.featuresItem}>
                                        <div className={styles.featuresImg}>
                                            <Image
                                                src="/images/lp/features_1.png"
                                                alt="ピン押した後の画面"
                                                width={400}
                                                height={500}
                                            />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>行きたい気持ちを逃さない</h4>
                                            <p>
                                                気になった飲食店を検索し、その場でマップにピンとして保存。
                                                一言コメントと行きたい期間を残すことで、
                                                「気になったまま放置」を防ぎます。
                                            </p>
                                        </div>
                                    </div>
                                </article>
                                <article className={styles.features}>
                                    <h3 className={styles.featuresTitle}>機能2</h3>
                                    <div className={styles.featuresItem}>
                                        <div className={styles.featuresImg}>
                                            <Image
                                                src="/images/lp/features_2.png"
                                                alt="ピン押した後の画面"
                                                width={400}
                                                height={500}
                                            />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>迷わず決められる</h4>
                                            <p>
                                                ピンには行きたい理由や雰囲気が分かるコメントが集まります。他の人の視点や自分の予定と照らし合わせながら、一人で悩まず選べます。{" "}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                                <article className={styles.features}>
                                    <h3 className={styles.featuresTitle}>機能3</h3>
                                    <div className={styles.featuresItem}>
                                        <div className={styles.featuresImg}>
                                            <Image
                                                src="/images/lp/features_3.png"
                                                alt="ピン押した後の画面"
                                                width={400}
                                                height={500}
                                            />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>行動につなげる</h4>
                                            <p>
                                                友達の立てたピンの中で予定が合えばリアクション!
                                                <br />
                                                予定が簡単に立てられます
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                            <Image
                                src="/images/lp/character/features_line.svg"
                                alt=""
                                width={600}
                                height={100}
                                className={styles.featuresLine}
                                aria-hidden="true"
                            />
                        </section>
                        <section id="howto" className={styles.howtoWrap}>
                            <h2 className={styles.howtoTitle}>使い方</h2>
                            <ol className={styles.howtoList}>
                                <li className={styles.howtoItem}>
                                    <div className={styles.howtoImg}>
                                        <Image
                                            src="/images/lp/howto/step_1.png"
                                            alt="検索しているイラスト"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                    <div className={styles.howtoText}>
                                        <h3>STEP1</h3>
                                        <p>気になったお店を検索</p>
                                    </div>
                                </li>
                                <li className={styles.howtoItem}>
                                    <div className={styles.howtoImg}>
                                        <Image
                                            src="/images/lp/howto/step_2.svg"
                                            alt="ピンの中身のイラスト"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                    <div className={styles.howtoText}>
                                        <h3>STEP2</h3>
                                        <p>そのお店とスケジュールと一言をつけた ピンを共有</p>
                                    </div>
                                </li>
                                <li className={styles.howtoItem}>
                                    <div className={styles.howtoImg}>
                                        <Image
                                            src="/images/lp/howto/step_3.png"
                                            alt="いいねしているイラスト"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                    <div className={styles.howtoText}>
                                        <h3>STEP3</h3>
                                        <p>自分が登録したピンに 友人がリアクション</p>
                                    </div>
                                </li>
                                <li className={styles.howtoItem}>
                                    <div className={styles.howtoImg}>
                                        <Image
                                            src="/images/lp/howto/step_4.png"
                                            alt="友人と仲良く話しているイラスト"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                    <div className={styles.howtoText}>
                                        <h3>STEP4</h3>
                                        <p>その友人とそのまま予定立ててLets go♪</p>
                                    </div>
                                </li>
                            </ol>
                        </section>
                        <footer id="start" className={styles.footer}>
                            <h2 className="sr-only">今すぐ始める</h2>
                            <Image
                                src="/images/logo.svg"
                                alt="たべごろのロゴ"
                                width={300}
                                height={398}
                                className={styles.logo}
                            />
                            <Image
                                src="/images/lp/mockup_top.png"
                                alt="アプリ画面のモックアップ画像"
                                width={600}
                                height={600}
                                className={styles.mockUp}
                            />
                            <div>
                                <LpBtn />
                            </div>
                            <p>
                                <small>&copy; 2025 tabegoro</small>
                            </p>
                        </footer>
                    </div>
                </div>
            </main>

            <aside className={styles.rightSide}>
                <LpBtn />
            </aside>
        </div>
    );
}
