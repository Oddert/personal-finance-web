import type { FC } from 'react';

import { Box } from '@mui/material';

import type { IProps } from './PastData.types';

import MonthRangeRequest from '../MonthRangeRequest/MonthRangeRequest';

const PastData: FC<IProps> = () => {
    const handleClickLoad = () => {};
    return (
        <Box>
            <MonthRangeRequest onClickLoad={handleClickLoad} />
        </Box>
    );
};

export default PastData;
