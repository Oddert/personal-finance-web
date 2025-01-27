import { FC, Fragment } from 'react';

import { Button } from '@mui/material';
import { Add as PlusIcon } from '@mui/icons-material';

import router from '../../../../constants/routerConstants';

import type { IProps } from './CreateCardButton.types';

/**
 * Displays a button to allow users to navigate to the create-card page.
 * @component
 * @category Pages
 * @subcategory Manage Cards
 */
const CreateCardButton: FC<IProps> = () => {
    const handleClick = () => {
        router.navigate('/');
    };

    return (
        <Fragment>
            <Button onClick={handleClick} variant='contained'>
                <PlusIcon /> Add new card
            </Button>
        </Fragment>
    );
};

export default CreateCardButton;
