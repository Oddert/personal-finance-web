import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {
    Box,
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

/**
 * Displays a single Schedule to edit.
 * @category Pages
 * @subcategory Edit Scenario
 * @component
 * @param props.handleChangeScheduler Callback function to edit this row.
 * @param props.handleClickDeleteScheduler Callback function to delete this row.
 * @param props.scheduler The scheduler to edit.
 */
const SchedulerRow: FC<IProps> = ({
    handleChangeScheduler,
    handleClickDeleteScheduler,
    scheduler,
}) => {
    const { t } = useTranslation();

    const inputDayOfMonth = (
        <TextField
            label={t('Scenario.Scheduler.labelDay')}
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
            label={t('Scenario.Scheduler.labelNthDay')}
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
            label={t('Scenario.Scheduler.labelStep')}
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
        <ListItem
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gridGap: '16px',
            }}
        >
            <Box sx={{ display: 'flex', gridGap: '16px' }}>
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
                    <MenuItem value='DAY'>
                        {t('Scenario.Scheduler.descriptionDay')}
                    </MenuItem>
                    <MenuItem value='SCALAR'>
                        {t('Scenario.Scheduler.descriptionScalar')}
                    </MenuItem>
                    <MenuItem value='DAY_OF_WEEK'>
                        {t('Scenario.Scheduler.descriptionDayOfWeek')}
                    </MenuItem>
                    <MenuItem value='EVENT'>
                        {t('Scenario.Scheduler.descriptionEvent')}
                    </MenuItem>
                </Select>
                {switchLayout()}
            </Box>
            <Tooltip title={t('Scenario.Scheduler.deleteSchedule')}>
                <Button onClick={handleClickDeleteScheduler}>
                    <IconDelete />
                </Button>
            </Tooltip>
        </ListItem>
    );
};

export default SchedulerRow;
