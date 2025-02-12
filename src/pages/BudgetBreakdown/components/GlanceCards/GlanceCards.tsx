import { FC, Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    CircularProgress,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';

import type { IBudgetDatum } from '../../../../types/Budget.types';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import { normaliseNum } from '../../../../utils/mathsUtils';

import type { IProps } from './GlanceCards.types';

/**
 * A series of 'at-a-glance' cards, presenting high-level insights.
 * @category Pages
 * @subcategory Budget Breakdown
 * @component
 */
const GlanceCards: FC<IProps> = ({ data, monthBudget, numMonths }) => {
    const { t } = useTranslation();

    const [actualSpend, setActualSpend] = useState(0);
    const [largestOverspendPc, setLargestOverspendPc] =
        useState<IBudgetDatum | null>(null);
    const [largestOverspendVal, setLargestOverspendVal] =
        useState<IBudgetDatum | null>(null);
    const [numUnderSpend, setNumUnderspend] = useState<IBudgetDatum[]>([]);
    const [numOverSpend, setNumOverSpend] = useState<IBudgetDatum[]>([]);

    useEffect(() => {
        interface IAccumulator {
            nextActualSpend: number;
            nextOverSpendPc: IBudgetDatum;
            nextOverSpendVal: IBudgetDatum;
            nextNumUnderSpend: IBudgetDatum[];
            nextNumOverSpend: IBudgetDatum[];
        }

        const {
            nextActualSpend,
            nextOverSpendPc,
            nextOverSpendVal,
            nextNumUnderSpend,
            nextNumOverSpend,
        } = data.reduce(
            (accumulator: IAccumulator, datum) => {
                accumulator.nextActualSpend += datum.spend;
                if (datum.diffPc > accumulator.nextOverSpendPc.diffPc) {
                    accumulator.nextOverSpendPc = datum;
                }
                if (datum.diffFloat > accumulator.nextOverSpendVal.diffFloat) {
                    accumulator.nextOverSpendVal = datum;
                }
                if (datum.diffPc < 0 && datum.diffPc <= datum.variance[0]) {
                    accumulator.nextNumUnderSpend.push(datum);
                }
                if (datum.diffPc > 0 && datum.diffPc >= datum.variance[1]) {
                    accumulator.nextNumOverSpend.push(datum);
                }
                return accumulator;
            },
            {
                nextActualSpend: 0,
                nextOverSpendPc: data[0],
                nextOverSpendVal: data[0],
                nextNumUnderSpend: [],
                nextNumOverSpend: [],
            },
        );
        setActualSpend(normaliseNum(nextActualSpend));
        setLargestOverspendPc(nextOverSpendPc);
        setLargestOverspendVal(nextOverSpendVal);
        setNumUnderspend(nextNumUnderSpend);
        setNumOverSpend(nextNumOverSpend);
    }, [data]);

    const expectedSpend = useMemo(() => {
        if (monthBudget) {
            return (
                monthBudget.budgetRows.reduce(
                    (a: number, e) => a + e.value,
                    0,
                ) * numMonths
            );
        }
        return 0;
    }, [monthBudget, numMonths]);

    const spendDiff = useMemo(
        () => normaliseNum(actualSpend - expectedSpend),
        [actualSpend, expectedSpend],
    );

    const { currencyLocaliser } = useLocalisedNumber();

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gridGap: '16px 32px',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    padding: '16px 32px',
                }}
            >
                <Typography sx={{ fontSize: '1.3rem' }}>
                    {t('Budget.totalExpectedSpend')}: {expectedSpend}
                </Typography>
                <Typography sx={{ fontSize: '1.3rem' }}>
                    {t('Budget.totalActualSpend')}: {actualSpend}
                </Typography>
            </Paper>
            <Paper
                elevation={0}
                sx={{
                    padding: '16px 32px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{ fontSize: '1.3rem' }}>
                    {spendDiff < 0 ? '-' : '+'} {currencyLocaliser(spendDiff)}{' '}
                    {spendDiff < 0 ? t('literals.bellow') : t('literals.above')}{' '}
                    {t('literals.budget')}
                </Typography>
            </Paper>
            <Paper
                elevation={0}
                sx={{
                    padding: '16px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                }}
            >
                {largestOverspendPc && largestOverspendVal ? (
                    <Fragment>
                        <Typography>{t('Budget.largestOverspend')}</Typography>
                        <Typography>
                            {t('Budget.byPercent')}:{' '}
                            <Typography
                                component='span'
                                sx={{ fontWeight: 'bold' }}
                            >
                                {largestOverspendPc.categoryName} (+{' '}
                                {largestOverspendPc.diffPc}%)
                            </Typography>
                        </Typography>
                        <Typography>
                            By value:{' '}
                            <Typography
                                component='span'
                                sx={{ fontWeight: 'bold' }}
                            >
                                {largestOverspendVal.categoryName} (+{' '}
                                {currencyLocaliser(
                                    largestOverspendVal.diffFloat,
                                )}
                                )
                            </Typography>
                        </Typography>
                    </Fragment>
                ) : (
                    <CircularProgress />
                )}
            </Paper>
            <Paper
                elevation={0}
                sx={{
                    padding: '16px 32px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Tooltip
                    title={numOverSpend
                        .map((datum) => datum.categoryName)
                        .join(', ')}
                >
                    <Typography>
                        {t('Budget.numCategoriesOverBudget')}:{' '}
                        {numOverSpend.length}
                    </Typography>
                </Tooltip>
                <Tooltip
                    title={numUnderSpend
                        .map((datum) => datum.categoryName)
                        .join(', ')}
                >
                    <Typography>
                        {t('Budget.numCategoriesUnderBudget')}:{' '}
                        {numUnderSpend.length}
                    </Typography>
                </Tooltip>
            </Paper>
        </Box>
    );
};

export default GlanceCards;
