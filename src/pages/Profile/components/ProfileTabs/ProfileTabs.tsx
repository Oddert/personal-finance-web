import { FC, SyntheticEvent, useCallback } from 'react';
import { Tab, Tabs } from '@mui/material';

import { IProps } from './ProfileTabs.types';

const ProfileTabs: FC<IProps> = ({ tab, setTab }) => {
    const handleChange = useCallback(
        (event: SyntheticEvent, value: string) => setTab(value),
        [setTab],
    );

    return (
        <Tabs
            onChange={handleChange}
            orientation='vertical'
            sx={{ minWidth: 'max-content', mr: 4 }}
            value={tab}
        >
            <Tab label='Cards' value='cards' />
            <Tab label='Language & Currency' value='localisation' />
            <Tab label='Profile' value='profile' />
            <Tab label='Appearance' value='appearance' />
            <Tab label='Security' value='security' />
        </Tabs>
    );
};

export default ProfileTabs;
