import { type FC, Fragment, type MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Add as IconPlus } from '@mui/icons-material';
import { Button, ListItem } from '@mui/material';

import type { IProps } from './CreateBudgetCard.types';

import CreateBudgetMenu from '../CreateBudgetMenu';

/**
 * Displays a card component, rendering similarly to the {@link BudgetCard} to allow users to navigate to the create-budget page.
 * @component
 * @category Pages
 * @subcategory Manage Budgets
 */
const CreateBudgetCard: FC<IProps> = () => {
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
            <ListItem>
                <Button
                    onClick={handleClick}
                    sx={{
                        width: '100%',
                        height: '100%',
                        minHeight: '150px',
                    }}
                    title={t('Budget.createANewBudget')}
                    variant='outlined'
                >
                    <IconPlus fontSize='large' />
                </Button>
            </ListItem>
            <CreateBudgetMenu anchorEl={anchorEl} handleClose={handleClose} />
        </Fragment>
    );
};

export default CreateBudgetCard;
