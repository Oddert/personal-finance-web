import { ScheduleByEvent, ScheduleByScalarTime, ScheduleBySpecificDay } from '../schedulerUtils'

describe('[ScheduleByScalarTime : 1 day interval]', () => {
    it('increment() via one step', () => {
        const scheduler = new ScheduleByScalarTime(1, '1 jan 2024')
        const start = new Date('1 jan 2024')
        const end = new Date('2 jan 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('increment() via two steps', () => {
        const scheduler = new ScheduleByScalarTime(1, '1 jan 2024')
        const start = new Date('1 jan 2024')
        const end = new Date('3 jan 2024')
        const incremented1 = scheduler.increment(start)
        const incremented2 = scheduler.increment(incremented1)
        expect(incremented2).toEqual(end.getTime())
    })
    it('increment() across the month boundary', () => {
        const scheduler = new ScheduleByScalarTime(1, '1 jan 2024')
        let start: number|Date = new Date('20 jan 2024')
        const end = new Date('4 Feb 2024')
        for (let i=0; i < 15; i++) {
            start = scheduler.increment(start)
        }
        expect(start).toEqual(end.getTime())
    })
    it('getMonthTotal()', () => {
        const scheduler = new ScheduleByScalarTime(1, '1 jan 2024')
        const start = new Date('15 jan 2024')
        const end = new Date('15 feb 2024')
        const final = scheduler.getMonthTotal(start)
        expect(final.length).toBeGreaterThan(28)
        expect(final.length).toBeLessThan(32)
        expect(final[final.length - 1]).toEqual(end.getTime())
    })
    it('getMonthRemainder()', () => {
        const scheduler = new ScheduleByScalarTime(1, '1 jan 2024')
        const start = new Date('15 jan 2024')
        const end = new Date('31 jan 2024')
        const final = scheduler.getMonthRemainder(start)
        expect(final).toHaveLength(16)
        expect(final[final.length - 1]).toEqual(end.getTime())
    })
})

describe('[ScheduleByScalarTime : 3 day interval]', () => {
    it('increment() via one step', () => {
        const scheduler = new ScheduleByScalarTime(3, '1 jan 2024')
        const start = new Date('1 jan 2024')
        const end = new Date('4 jan 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('increment() via two steps', () => {
        const scheduler = new ScheduleByScalarTime(3, '1 jan 2024')
        const start = new Date('1 jan 2024')
        const end = new Date('7 jan 2024')
        const incremented1 = scheduler.increment(start)
        const incremented2 = scheduler.increment(incremented1)
        expect(incremented2).toEqual(end.getTime())
    })
    it('increment() across the month boundary', () => {
        const scheduler = new ScheduleByScalarTime(3, '1 jan 2024')
        let start: number|Date = new Date('11 jan 2024')
        const end = new Date('4 Feb 2024')
        for (let i=0; i < 8; i++) {
            start = scheduler.increment(start)
        }
        expect(start).toEqual(end.getTime())
    })
    it('getMonthTotal()', () => {
        const scheduler = new ScheduleByScalarTime(3, '1 jan 2024')
        const start = new Date('16 jan 2024')
        const end = new Date('15 feb 2024')
        const final = scheduler.getMonthTotal(start)
        expect(final).toHaveLength(10)
        expect(final[final.length - 1]).toEqual(end.getTime())
    })
    it('getMonthRemainder()', () => {
        const scheduler = new ScheduleByScalarTime(3, '1 jan 2024')
        const start = new Date('16 jan 2024')
        const end = new Date('31 jan 2024')
        const final = scheduler.getMonthRemainder(start)
        expect(final).toHaveLength(5)
        expect(final[final.length - 1]).toEqual(end.getTime())
    })
})

describe('[ScheduleByScalarTime : 10 day interval]', () => {
    it('increment() via one step', () => {
        const scheduler = new ScheduleByScalarTime(10, '1 jan 2024')
        const start = new Date('13 jan 2024')
        const end = new Date('23 jan 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('increment() via two steps', () => {
        const scheduler = new ScheduleByScalarTime(10, '1 jan 2024')
        const start = new Date('1 jan 2024')
        const end = new Date('21 jan 2024')
        const incremented1 = scheduler.increment(start)
        const incremented2 = scheduler.increment(incremented1)
        expect(incremented2).toEqual(end.getTime())
    })
    it('increment() across the month boundary', () => {
        const scheduler = new ScheduleByScalarTime(10, '1 jan 2024')
        let start: number|Date = new Date('5 jan 2024')
        const end = new Date('4 Feb 2024')
        for (let i=0; i < 3; i++) {
            start = scheduler.increment(start)
        }
        expect(start).toEqual(end.getTime())
    })
    it('getMonthTotal()', () => {
        const scheduler = new ScheduleByScalarTime(10, '15 jan 2024')
        const start = new Date('15 jan 2024')
        const end = new Date('14 feb 2024')
        const final = scheduler.getMonthTotal(start)
        expect(final).toHaveLength(3)
        expect(final[final.length - 1]).toEqual(end.getTime())
    })
    it('getMonthRemainder()', () => {
        const scheduler = new ScheduleByScalarTime(10, '15 jan 2024')
        const start = new Date('15 jan 2024')
        const end = new Date('25 jan 2024')
        const final = scheduler.getMonthRemainder(start)
        expect(final).toHaveLength(1)
        expect(final[final.length - 1]).toEqual(end.getTime())
    })
})

describe('[ScheduleByScalarTime : 31 day interval]', () => {
    it('increment() via one step', () => {
        const scheduler = new ScheduleByScalarTime(31, '1 jan 2024')
        const start = new Date('1 jan 2024')
        const end = new Date('1 feb 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('increment() via two steps', () => {
        const scheduler = new ScheduleByScalarTime(31, '1 jan 2024')
        const start = new Date('1 jan 2024')
        const end = new Date('3 march 2024')
        const incremented1 = scheduler.increment(start)
        const incremented2 = scheduler.increment(incremented1)
        expect(incremented2).toEqual(end.getTime())
    })
    it('getMonthTotal()', () => {
        const scheduler = new ScheduleByScalarTime(31, '15 jan 2024')
        const start = new Date('15 jan 2024')
        const end = new Date('15 feb 2024')
        const final = scheduler.getMonthTotal(start)
        expect(final).toHaveLength(1)
        expect(final[final.length - 1]).toEqual(end.getTime())
    })
    it('getMonthRemainder()', () => {
        const scheduler = new ScheduleByScalarTime(31, '1 jan 2024')
        const start = new Date('15 jan 2024')
        const final = scheduler.getMonthRemainder(start)
        expect(final).toHaveLength(0)
    })
})

describe('[ScheduleBySpecificDay : 1st of month]', () => {
    it('increment() from start date', () => {
        const scheduler = new ScheduleBySpecificDay(1)
        const start = new Date('1 jan 2024')
        const end = new Date('1 feb 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('increment() from before start', () => {
        const scheduler = new ScheduleBySpecificDay(1)
        const start = new Date('25 dec 2023')
        const end = new Date('1 jan 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('increment() from after start', () => {
        const scheduler = new ScheduleBySpecificDay(1)
        const start = new Date('15 jan 2024')
        const end = new Date('1 feb 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('getMonthTotal()', () => {
        const scheduler = new ScheduleBySpecificDay(1)
        const start = new Date('15 jan 2024')
        const end = new Date('1 feb 2024')
        const final = scheduler.getMonthTotal(start)
        expect(final).toHaveLength(1)
        expect(final[0]).toEqual(end.getTime())
    })
    it('getMonthRemainder() before date', () => {
        const scheduler = new ScheduleBySpecificDay(1)
        const start = new Date('25 dec 2023')
        const final = scheduler.getMonthRemainder(start)
        expect(final).toHaveLength(0)
    })
    it('getMonthRemainder() after date', () => {
        const scheduler = new ScheduleBySpecificDay(1)
        const start = new Date('5 jan 2024')
        const final = scheduler.getMonthRemainder(start)
        expect(final).toHaveLength(0)
    })
})

describe('[ScheduleBySpecificDay : 15th of month]', () => {
    it('increment() from start date', () => {
        const scheduler = new ScheduleBySpecificDay(15)
        const start = new Date('15 jan 2024')
        const end = new Date('15 feb 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('increment() from before start', () => {
        const scheduler = new ScheduleBySpecificDay(15)
        const start = new Date('1 jan 2024')
        const end = new Date('15 jan 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('increment() from after start', () => {
        const scheduler = new ScheduleBySpecificDay(15)
        const start = new Date('20 jan 2024')
        const end = new Date('15 feb 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('getMonthTotal()', () => {
        const scheduler = new ScheduleBySpecificDay(15)
        const start = new Date('1 jan 2024')
        const end = new Date('15 jan 2024')
        const final = scheduler.getMonthTotal(start)
        expect(final).toHaveLength(1)
        expect(final[0]).toEqual(end.getTime())
    })
    it('getMonthRemainder() before date', () => {
        const scheduler = new ScheduleBySpecificDay(15)
        const start = new Date('10 jan 2024')
        const end = new Date('15 jan 2024')
        const final = scheduler.getMonthRemainder(start)
        expect(final).toHaveLength(1)
        expect(final[0]).toEqual(end.getTime())
    })
    it('getMonthRemainder() after date', () => {
        const scheduler = new ScheduleBySpecificDay(15)
        const start = new Date('25 jan 2024')
        const final = scheduler.getMonthRemainder(start)
        expect(final).toHaveLength(0)
    })
})

describe('[ScheduleBySpecificDay : 31st of month]', () => {
    it('increment() from start date', () => {
        const scheduler = new ScheduleBySpecificDay(31)
        const start = new Date('31 jan 2024')
        const end = new Date('31 march 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
    it('increment() from before start', () => {
        const scheduler = new ScheduleBySpecificDay(31)
        const start = new Date('25 jan 2024')
        const end = new Date('31 jan 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(end.getTime())
    })
})

describe('[ScheduleByEvent : 15 february 2024]', () => {
    it('increment() from after start', () => {
        const scheduler = new ScheduleByEvent('15 february 2024')
        const start = new Date('25 february 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(null)
    })
    it('increment() from before start', () => {
        const scheduler = new ScheduleByEvent('15 february 2024')
        const start = new Date('25 january 2024')
        const incremented = scheduler.increment(start)
        expect(incremented).toEqual(new Date('15 february 2024').getTime())
    })
    it('getMonthTotal() includes date', () => {
        const scheduler = new ScheduleByEvent('1 march 2024')
        const start = new Date('15 february 2024')
        const end = new Date('1 march 2024')
        const final = scheduler.getMonthTotal(start)
        expect(final).toHaveLength(1)
        expect(final[0]).toEqual(end.getTime())
    })
    it('getMonthTotal() does not include date', () => {
        const scheduler = new ScheduleByEvent('25 march 2024')
        const start = new Date('15 february 2024')
        const final = scheduler.getMonthTotal(start)
        expect(final).toHaveLength(0)
    })
    it('getMonthRemainder() includes date', () => {
        const scheduler = new ScheduleByEvent('15 february 2024')
        const start = new Date('10 february 2024')
        const end = new Date('15 february 2024')
        const final = scheduler.getMonthRemainder(start)
        expect(final).toHaveLength(1)
        expect(final[0]).toEqual(end.getTime())
    })
})
