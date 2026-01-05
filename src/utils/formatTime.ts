export const formatTime = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
};
