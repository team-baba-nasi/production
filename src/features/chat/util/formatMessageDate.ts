const formatMessageDate = (isoString: string): string => {
    const date = new Date(isoString);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

    return `${month}/${day}(${weekDays[date.getDay()]})`;
};

export default formatMessageDate;
