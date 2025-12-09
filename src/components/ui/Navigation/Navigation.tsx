"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import styles from "@/components/ui/Navigation/Navigation.module.scss";
import clsx from "clsx";

type NavsObject = {
    text: string;
    href: string;
    icon: string;
};

type Navs = NavsObject[];

const Navigation = () => {
    const pathname = usePathname();
    const { data } = useCurrentUser();
    console.log(data);
    const profile_icon = data?.user?.profile_image_url ?? "/images/groups/test_icon.webp";

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
            icon: `${profile_icon}`,
        },
    ];
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
