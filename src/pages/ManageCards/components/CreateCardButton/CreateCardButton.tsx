import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@mui/material';
import { Add as PlusIcon } from '@mui/icons-material';

import router, { ROUTES } from '../../../../constants/routerConstants';

import type { IProps } from './CreateCardButton.types';

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
                <PlusIcon /> {t('commonButtons.addNewCard')}
            </Button>
        </Fragment>
    );
};

export default CreateCardButton;
