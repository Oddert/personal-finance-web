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

const QuickAddTools: FC<IProps> = () => {
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
                    <MonthAverages />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default QuickAddTools;
