import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import { Palette as IconAppearance } from '@mui/icons-material';

import SidebarMode from '../../components/SidebarMode';
import UserDetails from '../../components/UserDetails';

/**
 * Displays non-critical user details and app layout options.
 *
 * Allows the user to update these preferences.
 * @component
 * @category Pages
 * @subcategory Profile
 */
const Appearance: FC = () => {
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gridGap: '16px',
                padding: '0 0 64px 0',
                mb: 2,
                width: '100%',
            }}
        >
            <Typography sx={{ mb: 4 }} variant='h2'>
                <IconAppearance /> {t('pageTitles.profile.appearance')}
            </Typography>
            <UserDetails />
            <SidebarMode />
        </Box>
    );
};

export default Appearance;
