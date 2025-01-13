import { FC, useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Button, CircularProgress, Popover } from '@mui/material';

import TPTable from './components/TPTable';

import { IProps } from './TransactionPreview.types';

dayjs.extend(localizedFormat);

const TransactionPreview: FC<IProps> = ({
    anchorEl,
    categoryId,
    clearAnchorEl,
    endDate,
	open,
    startDate,
}) => {
    const [loading, setLoading] = useState(true);

    const handleClose = () => {
        setLoading(true);
        clearAnchorEl();
    };

    const id = open ? 'simple-popover' : undefined;

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Button onClick={handleClose}>Close</Button>
            {loading ? (
                <CircularProgress />
            ) : (
                <TPTable
					categoryId={categoryId}
					endDate={endDate}
					setLoading={setLoading}
					startDate={startDate}
				/>
            )}
        </Popover>
    )
}

export default TransactionPreview;
