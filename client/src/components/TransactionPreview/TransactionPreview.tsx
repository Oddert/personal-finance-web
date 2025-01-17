import { FC } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Button, Popover } from '@mui/material';

import TPTable from './components/TPTable';

import type { IProps } from './TransactionPreview.types';

dayjs.extend(localizedFormat);

const TransactionPreview: FC<IProps> = ({
    anchorEl,
    categoryId,
    clearAnchorEl,
    endDate,
	open,
    startDate,
}) => {

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
            <Button onClick={handleClose}>Close</Button>
			<TPTable
				categoryId={categoryId}
				endDate={endDate}
				startDate={startDate}
			/>
        </Popover>
    )
}

export default TransactionPreview;
