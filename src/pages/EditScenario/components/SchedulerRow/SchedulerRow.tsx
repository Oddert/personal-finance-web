import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {
    Button,
    ListItem,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Tooltip,
} from '@mui/material';
import { Delete as IconDelete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

import { TSchedulerCode } from '../../../../types/Scenario.types';

import { IProps } from './SchedulerRow.types';

dayjs.extend(localizedFormat);

const SchedulerRow: FC<IProps> = ({
    handleChangeScheduler,
    handleClickDeleteScheduler,
    scheduler,
}) => {
    const { t } = useTranslation();

    const inputDayOfMonth = (
        <TextField
            label='Day of month'
            onChange={(event) => {
                const num = Number(event.target.value);
                if (num >= 0 && num <= 31) {
                    handleChangeScheduler({
                        ...scheduler,
                        day: num,
                    });
                }
            }}
            type='number'
            value={scheduler.day}
        />
    );

    const inputNthDay = (
        <TextField
            label='Every nth day (optional)'
            onChange={(event) =>
                handleChangeScheduler({
                    ...scheduler,
                    nthDay: Number(event.target.value),
                })
            }
            type='number'
            value={scheduler.nthDay}
        />
    );

    const inputDate = (
        <DatePicker
            label={t('Start date')}
            name='startDate'
            onChange={(value) =>
                handleChangeScheduler({
                    ...scheduler,
                    startDate: value?.toString() || null,
                })
            }
            showDaysOutsideCurrentMonth
            slotProps={{
                toolbar: {
                    toolbarFormat: 'ddd DD MMMM',
                    hidden: false,
                },
            }}
            sx={{
                borderRadius: '4px',
            }}
            value={dayjs(scheduler.startDate)}
        />
    );

    const inputStep = (
        <TextField
            label='Step'
            onChange={(event) =>
                handleChangeScheduler({
                    ...scheduler,
                    step: Number(event.target.value),
                })
            }
            type='number'
            value={scheduler.step}
        />
    );

    const switchLayout = () => {
        switch (scheduler.schedulerCode) {
            case 'DAY':
                return <Fragment>{inputDayOfMonth}</Fragment>;
            case 'DAY_OF_WEEK':
                return (
                    <Fragment>
                        {inputDayOfMonth}
                        {inputNthDay}
                    </Fragment>
                );
            case 'EVENT':
                return <Fragment>{inputDate}</Fragment>;
            case 'SCALAR':
                return (
                    <Fragment>
                        {inputStep}
                        {inputDate}
                    </Fragment>
                );
            default:
                return null;
        }
    };

    return (
        <ListItem sx={{ display: 'flex', gridGap: '16px' }}>
            <Select
                onChange={(event: SelectChangeEvent<TSchedulerCode>) =>
                    handleChangeScheduler({
                        ...scheduler,
                        // @ts-expect-error For some reason TSchedulerCode not being picked up here
                        schedulerCode: event.target.value,
                    })
                }
                value={scheduler.schedulerCode}
            >
                <MenuItem value='DAY'>Repeat a day of the month</MenuItem>
                <MenuItem value='SCALAR'>Repeating event</MenuItem>
                <MenuItem value='DAY_OF_WEEK'>
                    Repeat on a day of the week
                </MenuItem>
                <MenuItem value='EVENT'>
                    Schedule for a specific date (one time)
                </MenuItem>
            </Select>
            {switchLayout()}
            <Tooltip title='Delete Schedule'>
                <Button onClick={handleClickDeleteScheduler}>
                    <IconDelete />
                </Button>
            </Tooltip>
        </ListItem>
    );
};

export default SchedulerRow;
