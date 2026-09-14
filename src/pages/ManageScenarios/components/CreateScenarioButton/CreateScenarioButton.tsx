import { type FC, Fragment, type MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Add as IconPlus } from '@mui/icons-material';
import { Button } from '@mui/material';

import type { IProps } from './CreateScenarioButton.types';

import router, { ROUTES } from '../../../../constants/routerConstants';
import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';
import { getScenarioCount } from '../../../../redux/selectors/scenarioSelectors';
import CreateBudgetMenu from '../CreateScenarioMenu';

/**
 * Displays a button to allow users to navigate to the create-scenario page.
 * @component
 * @category Pages
 * @subcategory Manage Scenarios
 */
const CreateScenarioButton: FC<IProps> = () => {
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const scenarioCount = useAppSelector(getScenarioCount);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (scenarioCount > 0) {
            setAnchorEl(event.currentTarget);
        } else {
            router.navigate(ROUTES.CREATE_SCENARIO);
            handleClose();
        }
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
