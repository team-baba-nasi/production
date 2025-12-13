"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/ui/Navigation/Navigation";

const shouldHideNavigation = (pathname: string): boolean => {
    if (pathname.startsWith("/auth")) return true;

    if (pathname.startsWith("/groups/") && pathname !== "/groups") {
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
