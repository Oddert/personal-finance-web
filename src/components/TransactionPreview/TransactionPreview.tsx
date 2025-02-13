import { FC } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Button, Popover } from '@mui/material';

import TPTable from './components/TPTable';

import type { IProps } from './TransactionPreview.types';
import { useTranslation } from 'react-i18next';

dayjs.extend(localizedFormat);

/**
 * Popover component which displays a range of transactions for a particular category and date range.
 *
 * Intended for use with {@link BudgetPercentageChart} but is flexible and can be used elsewhere if desired.
 * @category Components
 * @subcategory Transaction Preview
 * @component
 * @param props.anchorEl The element to connect the Popover to.
 * @param props.categoryId The category of transactions to pull.
 * @param props.clearAnchorEl Callback function invoked when the Popover requests to close.
 * @param props.endDate The end date to pull transactions from.
 * @param props.open If true, the popover will display.
 * @param props.startDate The start date to pull transactions from.
 */
const TransactionPreview: FC<IProps> = ({
    anchorEl,
    categoryId,
    clearAnchorEl,
    endDate,
    open,
    startDate,
}) => {
    const { t } = useTranslation();

    const handleClose = () => {
        clearAnchorEl();
    };

    const id = open ? 'simple-popover' : undefined;

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={id}
            onClose={handleClose}
            open={open}
            slotProps={{
                paper: {
                    sx: {
                        maxHeight: '80vh',
                    },
                },
            }}
        >
            <Button onClick={handleClose}>{t('buttons.Close')}</Button>
            <TPTable
                categoryId={categoryId}
                endDate={endDate}
                startDate={startDate}
            />
        </Popover>
    );
};

export default TransactionPreview;
