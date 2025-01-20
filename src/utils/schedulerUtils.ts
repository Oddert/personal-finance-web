/**
 * Returns the millisecond timestamp for a date while normalising the time
 * to avoid discrepancies introduced by time zones.
 *
 * For example, during British SUmmer Time (BST) schedulers that increment
 * via scalar values will produce dates at 0100 hrs, while exact date
 * matchers will still show midnight.
 * @param date The date object or date compatible string / number.
 * @returns The date timestamp at midnight.
 */
export const normaliseDateStamp = (date: Date | number | string) => {
    const parsedDate = new Date(date);
    parsedDate.setHours(0);
    parsedDate.setMinutes(0);
    parsedDate.setSeconds(0);
    parsedDate.setMilliseconds(0);
    return parsedDate.getTime();
};

class Schedule {
    getRange(startDate: number | Date, endDate: number | Date): number[] {
        return [];
    }

    getMonthTotal(startDate: number | Date) {
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        return this.getRange(startDate, endDate);
    }

    getCurrentMonth(startDate: number | Date) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(startDate);
        startDateObj.setDate(1);
        endDateObj.setMonth(endDateObj.getMonth() + 1);
        endDateObj.setDate(0);
        return this.getRange(startDateObj, endDateObj);
    }
}

export class ScheduleByScalarTime extends Schedule {
    step: number;

    startDate: Date;

    /**
     * @param _step Number of days between each date.
     * @param _startDate The date the increment begins from.
     */
    constructor(_step: number, _startDate: string | number | Date) {
        super();
        this.step = _step;
        this.startDate = new Date(_startDate);
    }

    getLastIncrement(startDate: number | Date) {
        const diff = Math.abs(
            (new Date(startDate).getTime() - this.startDate.getTime()) /
                86400000,
        );
        const remainder = diff % this.step;
        const date = new Date(startDate);
        date.setDate(date.getDate() - remainder);
        return date;
    }

    increment(startDate: number | Date) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + this.step);
        return normaliseDateStamp(date);
    }

    getRange(startDate: number | Date, endDate: number | Date) {
        const startDateObj = new Date(startDate);
        const date = new Date(this.getLastIncrement(startDate));
        const endDateObj = new Date(endDate);
        const times = [];
        while (date.getTime() < endDateObj.getTime()) {
            date.setDate(date.getDate() + this.step);
            const currentTime = date.getTime();
            if (
                currentTime >= startDateObj.getTime() &&
                currentTime <= endDateObj.getTime()
            ) {
                times.push(normaliseDateStamp(date));
            }
        }
        return times;
    }

    getMonthRemainder(startDate: number | Date) {
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        return this.getRange(startDate, endDate);
    }
}

export class ScheduleBySpecificDay extends Schedule {
    day: number;

    constructor(_day: number) {
        super();
        this.day = _day;
    }

    increment(startDate: Date) {
        const date = new Date(startDate);
        if (this.day <= date.getDate()) {
            date.setMonth(date.getMonth() + 1);
        }
        date.setDate(this.day);
        return normaliseDateStamp(date);
    }

    getRange(startDate: number | Date, endDate: number | Date) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const times = [];
        while (startDateObj.getTime() <= endDateObj.getTime()) {
            startDateObj.setTime(this.increment(startDateObj));
            if (startDateObj.getTime() <= endDateObj.getTime()) {
                times.push(normaliseDateStamp(startDateObj));
            }
        }
        return times;
    }

    getMonthRemainder(startDate: number | Date) {
        const start = new Date(startDate);
        if (start.getDate() <= this.day) {
            start.setDate(this.day);
            return [normaliseDateStamp(start)];
        }
        return [];
    }
}

type shortDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

const dayToInt: { [key in shortDay]: number } = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
};

const intToDay: { [key: number]: shortDay } = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
};

// TODO: add nth day
export class ScheduleByDayOfWeek extends Schedule {
    day: number;

    dayReadable: shortDay;

    everyNthDay?: number;

    constructor(_day: number | shortDay, _everyNthDay?: number) {
        super();
        this.day = typeof _day === 'string' ? dayToInt[_day] : _day;
        this.dayReadable = typeof _day === 'number' ? intToDay[_day] : _day;
        this.everyNthDay = _everyNthDay;
    }

    increment(startDate: Date) {
        if (startDate.getDay() < this.day) {
            startDate.setDate(
                startDate.getDate() + 7 - (this.day - startDate.getDay()),
            );
        } else {
            startDate.setDate(
                startDate.getDate() + (startDate.getDay() - this.day),
            );
        }
        return normaliseDateStamp(startDate);
    }

    getRange(startDate: number | Date, endDate: number | Date) {
        const start = new Date(startDate);
        const startDateObj =
            start.getDay() === this.day
                ? start
                : new Date(this.increment(start));
        const endDateObj = new Date(this.increment(new Date(endDate)));
        const times = [];
        while (startDateObj <= endDateObj) {
            times.push(normaliseDateStamp(startDateObj));
            if (startDateObj.getTime() <= endDateObj.getTime()) {
                startDateObj.setDate(startDateObj.getDate() + 7);
            }
        }
        return times;
    }

    getMonthRemainder(startDate: number | Date) {
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        return this.getRange(startDate, endDate);
    }
}

export class ScheduleByEvent extends Schedule {
    date: Date;

    constructor(_date: string | number | Date) {
        super();
        this.date = new Date(_date);
    }

    increment(startDate: Date) {
        if (this.date <= startDate) {
            return null;
        }
        return normaliseDateStamp(this.date);
    }

    getRange(startDate: number | Date, endDate: number | Date) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        if (this.date >= startDateObj && this.date <= endDateObj) {
            return [normaliseDateStamp(this.date)];
        }
        return [];
    }

    getMonthRemainder(startDate: number | Date) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(startDateObj);
        endDateObj.setDate(15);
        endDateObj.setMonth(endDateObj.getMonth() + 1);
        endDateObj.setDate(0);
        if (this.date >= startDateObj && this.date <= endDateObj) {
            return [normaliseDateStamp(this.date)];
        }
        return [];
    }
}

// TODO
// Every Scalar Time Period ✔️
// Every specific day ✔️
// On day of week
//  - Every Day✔️, Week, Month, Year
// Date range with flag to ignore year, month, day

// Apply set of exclusion rules?
// Rules can compound? Apply logic gate rules AND, OR, XOR, NOT
