import WeekDayBtn from "@/features/map/components/WeekDayBtn";

const test = () => {
    return (
        <>
            <WeekDayBtn active={true} week="月" day={22} />
            <WeekDayBtn active={false} week="火" day={23} />
        </>
    );
};

export default test;
