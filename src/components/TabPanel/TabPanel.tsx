import { Box } from '@mui/material';

import type { IProps } from './TabPanel.types';

const TabPanel = <TTab extends string | number = string | number>({
    children,
    index,
    panelPrefix,
    tab,
    ...other
}: IProps<TTab>) => {
    return (
        <div
            aria-labelledby={`${panelPrefix}-tab-${String(index)}`}
            hidden={tab !== index}
            id={`${panelPrefix}-tabpanel-${String(index)}`}
            role='tabpanel'
            tabIndex={0}
            {...other}
        >
            {tab === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

export default TabPanel;
