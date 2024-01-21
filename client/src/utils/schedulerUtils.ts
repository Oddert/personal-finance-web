class Schedule {
    getRange(startDate: number|Date, endDate: number|Date): number[] {
        return []
    }    

    getMonthTotal(startDate: number|Date) {
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + 1)
        return this.getRange(startDate, endDate)
    }

    getCurrentMonth(startDate: number|Date) {
        const startDateObj = new Date(startDate)
        const endDateObj = new Date(startDate)
        startDateObj.setDate(1)
        endDateObj.setMonth(endDateObj.getMonth() + 1)
        endDateObj.setDate(0)
        return this.getRange(startDateObj, endDateObj)
    }
}

export class ScheduleByScalarTime extends Schedule {
    step: number

    /**
     * @param _step Number of days between each date.
     */
    constructor(_step: number) {
        super()
        this.step = _step
    }

    increment(startDate: number|Date) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + this.step)
        return date.getTime()
    }

    getRange(startDate: number|Date, endDate: number|Date) {
        const startDateObj = new Date(startDate)
        const endDateObj = new Date(endDate)
        const times = []
        while (startDateObj.getTime() < endDateObj.getTime()) {
            startDateObj.setDate(startDateObj.getDate() + this.step)
            if (startDateObj.getTime() <= endDateObj.getTime()) {
                times.push(startDateObj.getTime())
            }
        }
        return times
    }
    
    getMonthRemainder(startDate: number|Date) {
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + 1)
        endDate.setDate(0)
        return this.getRange(startDate, endDate)
    }
}

export class ScheduleBySpecificDay extends Schedule {
    day: number
    
    constructor(_day: number) {
        super()
        this.day = _day
    }

    increment(startDate: Date) {
        const date = new Date(startDate)
        if (this.day <= date.getDate()) {
            date.setMonth(date.getMonth() + 1)
        }
        date.setDate(this.day)
        return date.getTime()
    }
    
    getRange(startDate: number|Date, endDate: number|Date) {
        const startDateObj = new Date(startDate)
        const endDateObj = new Date(endDate)
        const times = []
        while (startDateObj.getTime() <= endDateObj.getTime()) {
            startDateObj.setTime(this.increment(startDateObj))
            if (startDateObj.getTime() <= endDateObj.getTime()) {
                times.push(startDateObj.getTime())
            }
        }
        return times
    }

    getMonthRemainder(startDate: number|Date) {
        const start = new Date(startDate)
        if (start.getDate() <= this.day) {
            start.setDate(this.day)
            return [start.getTime()]
        }
        return []
    }
}

type shortDay = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun'

const dayToInt: { [key in shortDay]: number } = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
}

const intToDay: { [key: number]: shortDay } = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
}

export class ScheduleByDayOfWeek extends Schedule {
    day: number
    dayReadable: shortDay

    constructor(_day: number|shortDay) {
        super()
        this.day = typeof _day === 'string' ? dayToInt[_day] : _day
        this.dayReadable = typeof _day === 'number' ? intToDay[_day] : _day
    }

    increment(startDate: Date) {
        if (startDate.getDay() < this.day) {
            startDate.setDate(startDate.getDate() + 7 - (this.day - startDate.getDay()))
        } else {
            startDate.setDate(startDate.getDate() + (startDate.getDay() - this.day))
        }
        return startDate.getTime()
    }
    
    getRange(startDate: number|Date, endDate: number|Date) {
        const start = new Date(startDate)
        const startDateObj = start.getDay() === this.day ? start : new Date(this.increment(start))
        const endDateObj = new Date(this.increment(new Date(endDate)))
        const times = []
        while (startDateObj <= endDateObj) {
            times.push(startDateObj.getTime())            
            if (startDateObj.getTime() <= endDateObj.getTime()) {
                startDateObj.setDate(startDateObj.getDate() + 7)
            }
        }
        return times
    }

    getMonthRemainder(startDate: number|Date) {
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + 1)
        endDate.setDate(0)
        return this.getRange(startDate, endDate)
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
