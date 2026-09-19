import { readCsv } from './commonUtils';

describe('readCsv', () => {
    it('normalises uppercase month abbreviations in imported dates', () => {
        const result = readCsv('date,description\n11 JUL 2026,Coffee\n');

        expect(result?.values).toEqual([
            { date: '11 Jul 2026', description: 'Coffee' },
        ]);
    });

    it('normalises dates in the final column with Windows line endings', () => {
        const result = readCsv('description,date\nCoffee,11 JUL 2026\r\n');

        expect(result?.values).toEqual([
            { description: 'Coffee', date: '11 Jul 2026\r' },
        ]);
    });

    it('leaves non-date uppercase values unchanged', () => {
        const result = readCsv('date,description\n11/07/2026,JUL SALE\n');

        expect(result?.values).toEqual([
            { date: '11/07/2026', description: 'JUL SALE' },
        ]);
    });
});
