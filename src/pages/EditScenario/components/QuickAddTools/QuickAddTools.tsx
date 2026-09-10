import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ChevronRight as IconExpand } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
} from '@mui/material';

import type { IProps } from './QuickAddTools.types';

import MonthAverages from './components/MonthAverages';
import PastData from './components/PastData';

const QuickAddTools: FC<IProps> = ({ setTransactors }) => {
    const { t } = useTranslation();
    return (
        <Box sx={{ flex: 1 }}>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<IconExpand />}>
                    {t('Scenario.monthlyCategoryAvg')}
                </AccordionSummary>
                <AccordionDetails>
                    <MonthAverages />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<IconExpand />}>
                    {t('Scenario.pastTransactions')}
                </AccordionSummary>
                <AccordionDetails>
                    <PastData setTransactors={setTransactors} />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default QuickAddTools;
