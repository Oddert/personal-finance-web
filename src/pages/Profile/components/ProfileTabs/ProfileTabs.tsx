import { FC, SyntheticEvent, useCallback } from 'react';
import { Tab, Tabs } from '@mui/material';

import router, { ROUTES } from '../../../../constants/routerConstants';

import { IProps } from './ProfileTabs.types';

const ProfileTabs: FC<IProps> = ({ value }) => {
    const handleChange = useCallback(
        (event: SyntheticEvent, nextLocation: string) => {
            router.navigate(`${ROUTES.PROFILE}/${nextLocation}`);
        },
        [],
    );

    return (
        <Tabs
            onChange={handleChange}
            orientation='vertical'
            sx={{ minWidth: 'max-content', mr: 4 }}
            value={value}
        >
            <Tab label='Language & Currency' value='localisation' />
            <Tab label='Profile' value='profile' />
            <Tab label='Appearance' value='appearance' />
            <Tab label='Security' value='security' />
        </Tabs>
    );
};

export default ProfileTabs;
