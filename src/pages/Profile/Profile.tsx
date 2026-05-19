import type { FC } from 'react';

import { Box } from '@mui/material';

import type { IProps } from './Profile.types';

import ProfileTabs from './components/ProfileTabs';

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
