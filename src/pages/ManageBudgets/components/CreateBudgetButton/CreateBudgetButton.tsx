import { FC, Fragment, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@mui/material';
import { Add as PlusIcon } from '@mui/icons-material';

import CreateBudgetMenu from '../CreateBudgetMenu';

import type { IProps } from './CreateBudgetButton.types';

/**
 * Displays a button to allow users to navigate to the create-budget page.
 * @component
 * @category Pages
 * @subcategory Manage Budgets
 */
const CreateBudgetButton: FC<IProps> = () => {
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Fragment>
            <Button onClick={handleClick} variant='contained'>
                <PlusIcon /> {t('buttons.createNewBudget')}
            </Button>
            <CreateBudgetMenu anchorEl={anchorEl} handleClose={handleClose} />
        </Fragment>
    );
};

export default CreateBudgetButton;
