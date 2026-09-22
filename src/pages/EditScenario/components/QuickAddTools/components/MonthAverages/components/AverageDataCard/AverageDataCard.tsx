import {
    type FC,
    Fragment,
    type MouseEvent,
    useCallback,
    useState,
} from 'react';

import { ArrowForward as IconAddTransaction } from '@mui/icons-material';
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    Paper,
    Popover,
    Typography,
} from '@mui/material';

import type { IProps } from './AverageDataCard.types';
import type { IAggregateDatapointExtended } from '../../MonthAverages.types';

import { useAppSelector } from '../../../../../../../../hooks/ReduxHookWrappers';
import { getActiveCardId } from '../../../../../../../../redux/selectors/cardSelectors';
import { ffBlankTransactorRowEditable } from '../../../../../../../../utils/factoryFunctions';
import AvgDataPointRow from '../AvgDataPointRow';

const AverageDataCard: FC<IProps> = ({
    dataPoint,
    onDataPointEnabledChange,
    setTransactors,
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const activeCardId = useAppSelector(getActiveCardId);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickAddWholeItem = useCallback(() => {
        setTransactors((transactors) => [
            ...transactors,
            ffBlankTransactorRowEditable({
                categoryId: dataPoint.categoryId,
                cardId: activeCardId,
                description: dataPoint.categoryName,
                isAddition: dataPoint.average >= 0,
                value: Math.abs(dataPoint.average),
            }),
        ]);
    }, [
        activeCardId,
        dataPoint.average,
        dataPoint.categoryId,
        dataPoint.categoryName,
        setTransactors,
    ]);

    const handleClickAddRow = useCallback(
        (row: IAggregateDatapointExtended) => {
            const value = row.totalCredit - row.totalDebit;
            setTransactors((transactors) => [
                ...transactors,
                ffBlankTransactorRowEditable({
                    categoryId: row.categoryId,
                    cardId: row.cardId,
                    description: row.categoryName,
                    isAddition: value >= 0,
                    value: Math.abs(value),
                }),
            ]);
        },
        [setTransactors],
    );

    const open = Boolean(anchorEl);
    const id = open ? `card-popover-${dataPoint.categoryId}` : undefined;

    return (
        <Fragment>
            <ListItem
                sx={{
                    p: 0,
                    m: 0,
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        height: '100%',
                        width: '100%',
                        px: 2,
                        py: 2,
                        borderLeft: `5px solid ${dataPoint.categoryColour}`,
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                    }}
                >
                    <Typography>{dataPoint.categoryName}</Typography>
                    <Typography>
                        {dataPoint.average}{' '}
                        <Typography
                            component='span'
                            sx={{ fontSize: '0.8rem' }}
                        >
                            +/- {dataPoint.standardDeviation}
                        </Typography>
                    </Typography>
                    <Box
                        sx={{
                            gridColumn: 2,
                            gridRow: '1 / span 2',
                        }}
                    >
                        <IconButton
                            aria-label=''
                            color='primary'
                            onClick={handleClickAddWholeItem}
                        >
                            <IconAddTransaction />
                        </IconButton>
                    </Box>
                    <Button
                        aria-describedby={id}
                        onClick={handleClick}
                        sx={{ justifySelf: 'start' }}
                    >
                        Details
                    </Button>
                </Paper>
            </ListItem>
            <Popover
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                id={id}
                onClose={handleClose}
                open={open}
            >
                <Typography sx={{ p: 2 }}>
                    The content of the Popover.
                </Typography>
                <List>
                    {dataPoint.data.map((datum, idx) => (
                        <AvgDataPointRow
                            datum={datum}
                            idx={idx}
                            key={idx}
                            onDataPointEnabledChange={onDataPointEnabledChange}
                            onClickAddRow={handleClickAddRow}
                        />
                    ))}
                </List>
            </Popover>
        </Fragment>
    );
};

export default AverageDataCard;
