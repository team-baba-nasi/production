"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/components/ui/Navigation/Navigation.module.scss";
import clsx from "clsx";

type NavsObject = {
    text: string;
    href: string;
    icon: string;
};

type Navs = NavsObject[];

const Navs: Navs = [
    {
        text: "チャット",
        href: "/chat",
        icon: "/images/navigation/chat.svg",
    },
    {
        text: "マップ",
        href: "/map",
        icon: "/images/navigation/map.svg",
    },
    {
        text: "通知",
        href: "/notice",
        icon: "/images/navigation/notice.svg",
    },
    {
        text: "プロフィール",
        href: "/profile",
        icon: "/images/navigation/chat.svg",
    },
];

const Navigation = () => {
    const pathname = usePathname();

    return (
        <div className={styles.navWrap}>
            {Navs.map((nav) => (
                <Link
                    key={nav.text}
                    href={`${nav.href}`}
                    className={clsx(
                        styles.iconWrap,
                        pathname.startsWith(nav.href) && styles.selected
                    )}
                >
                    <Image src={nav.icon} alt={`${nav.text}アイコン`} width={32} height={32} />
                    <p>{nav.text}</p>
                </Link>
            ))}
        </div>
    );
};
export default Navigation;
