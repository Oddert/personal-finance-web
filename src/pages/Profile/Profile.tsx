import { FC, useMemo, useState } from 'react';

import { Box } from '@mui/material';

// import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import ProfileTabs from './components/ProfileTabs';

import ManageCards from '../ManageCards';

import UserDetails from './Tabs/UserDetails';
import Language from './Tabs/Language';
import Appearance from './Tabs/Appearance';
import Security from './Tabs/Security';

import { IProps } from './Profile.types';

/**
 * A user profile and settings page.
 * @component
 * @category Pages
 * @subcategory Profile
 */
const Profile: FC<IProps> = () => {
    const [tab, setTab] = useState('cards');

    const switchTab = useMemo(() => {
        switch (tab) {
            case 'profile':
                return <UserDetails />;
            case 'localisation':
                return <Language />;
            case 'appearance':
                return <Appearance />;
            case 'security':
                return <Security />;
            case 'cards':
            default:
                return <ManageCards />;
        }
    }, [tab]);

    return (
        <Box sx={{ display: 'flex' }}>
            <ProfileTabs tab={tab} setTab={setTab} />
            <Box sx={{ px: 4, display: 'flex', width: '100%' }}>
                {switchTab}
            </Box>
        </Box>
    );
};

export default Profile;
