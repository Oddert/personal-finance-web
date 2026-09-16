import type { FC } from 'react';

import { ArrowForward as IconAddTransaction } from '@mui/icons-material';
import {
    Checkbox,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';

import type { IProps } from './AvgDataPointRow.types';

const AvgDataPointRow: FC<IProps> = ({
    datum,
    idx,
    onDataPointEnabledChange,
    onClickAddRow,
}) => {
    const labelId = datum.categoryId;
    return (
        <ListItem
            disablePadding
            key={idx}
            secondaryAction={
                <IconButton
                    aria-label=''
                    color='primary'
                    edge='end'
                    onClick={() => {
                        onClickAddRow(datum);
                    }}
                >
                    <IconAddTransaction />
                </IconButton>
            }
        >
            <ListItemButton
                dense
                // onClick={handleToggle(value)}
                role={undefined}
            >
                <ListItemIcon>
                    <Checkbox
                        checked={datum.enabled}
                        disableRipple
                        edge='start'
                        onChange={(event) => {
                            onDataPointEnabledChange(idx, event.target.checked);
                        }}
                        slotProps={{
                            input: {
                                'aria-labelledby': labelId,
                            },
                        }}
                        tabIndex={-1}
                    />
                </ListItemIcon>
                <ListItemText
                    id={labelId}
                    primary={`${(datum.totalCredit - datum.totalDebit).toFixed(2)}: ${datum.period} ${datum.cardName}`}
                />
            </ListItemButton>
        </ListItem>
    );
};

export default AvgDataPointRow;
