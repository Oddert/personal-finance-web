import { FC, SyntheticEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '@mui/material';

import router, { ROUTES } from '../../../../constants/routerConstants';

import { IProps } from './ProfileTabs.types';

/**
 * Tab selector for the profile page to switch between sub-sections.
 * @component
 * @category Pages
 * @subcategory Profile
 */
const ProfileTabs: FC<IProps> = ({ value }) => {
    const { t } = useTranslation();

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
            <Tab
                label={t('pageTitles.profile.language')}
                value='localisation'
            />
            <Tab
                label={t('pageTitles.profile.appearance')}
                value='appearance'
            />
            <Tab label={t('pageTitles.profile.security')} value='security' />
        </Tabs>
    );
};

export default ProfileTabs;
