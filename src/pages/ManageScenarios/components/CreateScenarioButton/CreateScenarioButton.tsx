import { FC, Fragment, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@mui/material';
import { Add as IconPlus } from '@mui/icons-material';

import CreateBudgetMenu from '../CreateScenarioMenu';

import type { IProps } from './CreateScenarioButton.types';

/**
 * Displays a button to allow users to navigate to the create-scenario page.
 * @component
 * @category Pages
 * @subcategory Manage Scenarios
 */
const CreateScenarioButton: FC<IProps> = () => {
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
                <IconPlus /> {t('buttons.createNewScenario')}
            </Button>
            <CreateBudgetMenu anchorEl={anchorEl} handleClose={handleClose} />
        </Fragment>
    );
};

export default CreateScenarioButton;
