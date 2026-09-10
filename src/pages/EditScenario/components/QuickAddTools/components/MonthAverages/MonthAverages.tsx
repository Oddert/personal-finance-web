import { type FC } from 'react';

import { Box } from '@mui/material';

import type { IProps } from './MonthAverages.types';

import MonthRangeRequest from '../MonthRangeRequest/MonthRangeRequest';

const MonthAverages: FC<IProps> = () => {
    const handleClickLoad = () => {
        const request = async () => {};
        request();
    };

    return (
        <Box>
            <MonthRangeRequest onClickLoad={handleClickLoad} />
        </Box>
    );
};

export default MonthAverages;
