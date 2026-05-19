import { type FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Add as IconPlus } from '@mui/icons-material';
import { Button } from '@mui/material';

import type { IProps } from './CreateCardButton.types';

import router, { ROUTES } from '../../../../constants/routerConstants';

/**
 * Displays a button to allow users to navigate to the create-card page.
 * @component
 * @category Pages
 * @subcategory Manage Cards
 */
const CreateCardButton: FC<IProps> = () => {
    const { t } = useTranslation();

    const handleClick = () => {
        router.navigate(ROUTES.CREATE_CARD);
    };

    return (
        <Fragment>
            <Button onClick={handleClick} variant='contained'>
                <IconPlus /> {t('buttons.addNewCard')}
            </Button>
        </Fragment>
    );
};

export default CreateCardButton;
