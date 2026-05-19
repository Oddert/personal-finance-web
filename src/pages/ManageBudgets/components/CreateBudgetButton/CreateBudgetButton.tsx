import { type FC, Fragment, type MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Add as IconPlus } from '@mui/icons-material';
import { Button } from '@mui/material';

import type { IProps } from './CreateBudgetButton.types';

import CreateBudgetMenu from '../CreateBudgetMenu';

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
                <IconPlus /> {t('buttons.createNewBudget')}
            </Button>
            <CreateBudgetMenu anchorEl={anchorEl} handleClose={handleClose} />
        </Fragment>
    );
};

export default CreateBudgetButton;
