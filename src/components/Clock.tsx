import React from "react";
import styles from '@/styles/Home.module.css'
import dayjs from "dayjs";

interface Props {
    time: number
};

function toDateStr(date: string): string {
    if (date.endsWith("1")) {
        if (date.endsWith("11")) return (date+"th");
        return (date+"st");
    } else if (date.endsWith("2")) {
        if (date.endsWith("12")) return (date+"th");
        return (date+"nd");
    } else if (date.endsWith("3")) {
        if (date.endsWith("13")) return (date+"th");
        return (date+"rd")
    } else {
        return (date+"th");
    }
}

const monthDict = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

function toMonthStr(month: number): string {
    return monthDict[month];
}

function getDateStr(month: number, date: string): string {
    return toDateStr(date)+"/"+toMonthStr(month);
}

export const Clock: React.FC<Props> = ({time}) => {
    const timeStr = dayjs(time).format("HH:mm:ss");
    const month = dayjs(time).month();
    const date = dayjs(time).format("DD");
    const dateStr = getDateStr(month, date);
    return (
        <div className={styles.clock}>
            <h3 className={styles.timeStr} suppressHydrationWarning>{timeStr}</h3>
            <h3 className={styles.dateStr} suppressHydrationWarning>{dateStr}</h3>
        </div>
    );
};

