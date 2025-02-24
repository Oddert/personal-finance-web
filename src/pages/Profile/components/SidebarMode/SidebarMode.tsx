import { ChangeEvent, FC } from 'react';

import { IProps } from './SidebarMode.types';
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from '@mui/material';

import { getSidebarMode } from '../../../../redux/selectors/profileSelectors';
import { changeSidebarMode } from '../../../../redux/slices/profileSlice';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';

import { TSidebarMode } from '../../../../types/Profile.types';

const SidebarMode: FC<IProps> = () => {
    const dispatch = useAppDispatch();

    const mode = useAppSelector(getSidebarMode);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(
            changeSidebarMode({ mode: event.target.value as TSidebarMode }),
        );
    };

    return (
        <FormControl>
            <FormLabel id='sidebar-mode'>Sidebar mode</FormLabel>
            <RadioGroup
                aria-labelledby='sidebar-mode'
                name='radio-sidebar-controls'
                onChange={handleChange}
                value={mode}
            >
                <FormControlLabel
                    control={<Radio />}
                    label='Discreet'
                    value='discreet'
                />
                <FormControlLabel
                    control={<Radio />}
                    label='Static'
                    value='static'
                />
            </RadioGroup>
        </FormControl>
    );
};

export default SidebarMode;
