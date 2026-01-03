"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/ui/Navigation/Navigation";

const shouldHideNavigation = (pathname: string): boolean => {
    // 認証系
    if (pathname.startsWith("/auth")) return true;

    // グループ詳細
    if (pathname.startsWith("/groups/") && pathname !== "/groups") {
        return true;
    }

    // チャット詳細
    if (pathname.startsWith("/chat/") && pathname !== "/chat") {
        return true;
    }

    return false;
};

export default function NavigationWrapper() {
    const pathname = usePathname();

    if (shouldHideNavigation(pathname)) {
        return null;
    }

    return <Navigation />;
}
