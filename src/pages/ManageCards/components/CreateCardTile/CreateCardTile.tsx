import { type FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Add as IconPlus } from '@mui/icons-material';
import { Button, ListItem } from '@mui/material';

import type { IProps } from './CreateCardTile.types';

import router, { ROUTES } from '../../../../constants/routerConstants';

/**
 * Displays a card component, rendering similarly to the {@link CardTile} to allow users to navigate to the create-card page.
 * @component
 * @category Pages
 * @subcategory Manage Card
 */
const CreateCardTile: FC<IProps> = () => {
    const { t } = useTranslation();

    const handleClick = () => {
        router.navigate(ROUTES.CREATE_CARD);
    };

    return (
        <Fragment>
            <ListItem>
                <Button
                    onClick={handleClick}
                    sx={{
                        width: '100%',
                        height: '100%',
                    }}
                    title={t('buttons.createANewCard')}
                    variant='outlined'
                >
                    <IconPlus fontSize='large' />
                </Button>
            </ListItem>
        </Fragment>
    );
};

export default CreateCardTile;
