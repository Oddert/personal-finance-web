import { FC } from 'react';

import { Box } from '@mui/material';

import ProfileTabs from './components/ProfileTabs';

import { IProps } from './Profile.types';

/**
 * A user profile and settings page.
 * @component
 * @category Pages
 * @subcategory Profile
 */
const Profile: FC<IProps> = ({ children, value }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <ProfileTabs value={value} />
            <Box sx={{ px: 4, display: 'flex', width: '100%' }}>{children}</Box>
        </Box>
    );
};

export default Profile;
