import { FC, Fragment } from 'react';

import { Button, ListItem } from '@mui/material';
import { Add as PlusIcon } from '@mui/icons-material';

import router, { ROUTES } from '../../../../constants/routerConstants';

import type { IProps } from './CreateCardTile.types';

/**
 * Displays a card component, rendering similarly to the {@link CardTile} to allow users to navigate to the create-card page.
 * @component
 * @category Pages
 * @subcategory Manage Card
 */
const CreateCardTile: FC<IProps> = () => {
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
                    title='Create a new card'
                    variant='outlined'
                >
                    <PlusIcon fontSize='large' />
                </Button>
            </ListItem>
        </Fragment>
    );
};

export default CreateCardTile;
