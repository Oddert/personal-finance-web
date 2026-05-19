import { type FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Delete as IconDelete } from '@mui/icons-material';
import {
    Button,
    MenuItem,
    Select,
    type SelectChangeEvent,
    TableCell,
    TableRow,
    TextField,
    Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import type { IProps } from './SchedulerRow.types';
import type { TSchedulerCode } from '../../../../types/Scenario.types';

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
            size='small'
            type='number'
            value={scheduler.day}
        />
    );

    const inputNthDay = (
        <TextField
            label={t('Scenario.Scheduler.labelNthDay')}
            onChange={(event) => {
                handleChangeScheduler({
                    ...scheduler,
                    nthDay: Number(event.target.value),
                });
            }}
            size='small'
            type='number'
            value={scheduler.nthDay}
        />
    );

    const inputDate = (
        <DatePicker
            label={t('Start date')}
            name='startDate'
            onChange={(value) => {
                handleChangeScheduler({
                    ...scheduler,
                    startDate: value?.toString() ?? null,
                });
            }}
            showDaysOutsideCurrentMonth
            slotProps={{
                textField: {
                    size: 'small',
                },
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
            onChange={(event) => {
                handleChangeScheduler({
                    ...scheduler,
                    step: Number(event.target.value),
                });
            }}
            size='small'
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
        <TableRow>
            <TableCell>
                <Select
                    onChange={(event: SelectChangeEvent<TSchedulerCode>) => {
                        handleChangeScheduler({
                            ...scheduler,
                            schedulerCode: event.target.value,
                        });
                    }}
                    size='small'
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
            </TableCell>
            <TableCell
                sx={{ display: 'flex', alignItems: 'center', gridGap: '8px' }}
            >
                {switchLayout()}
            </TableCell>
            <TableCell>
                <Tooltip title={t('Scenario.Scheduler.deleteSchedule')}>
                    <Button onClick={handleClickDeleteScheduler}>
                        <IconDelete />
                    </Button>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};

export default SchedulerRow;
