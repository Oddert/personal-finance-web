import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import {
    Window as IconLayoutStandard,
    Apps as IconLayoutCompact,
    TableRows as IconLayoutList,
} from '@mui/icons-material';

import type { IDynamicCardLayoutModes } from '../../types/Common.types';

import type { IProps } from './LayoutControls.types';

/**
 * Main navigation component, displays the page options.
 * @category Components
 * @subcategory Layout Controls
 * @component
 * @param props.layout The current layout mode.
 * @param props.setLayout Callback function to change the layout mode.
 */
const LayoutControls: FC<IProps> = ({ layout, setLayout }) => {
    const { t } = useTranslation();
    return (
        <FormControl>
            <RadioGroup
                aria-label={t('Layout')}
                defaultValue='standard'
                name='radio-buttons-group'
                onChange={(event) =>
                    setLayout(event.target.value as IDynamicCardLayoutModes)
                }
                sx={{
                    flexDirection: 'row',
                    padding: '0px 32px',
                }}
                value={layout}
            >
                <FormControlLabel
                    label=''
                    control={
                        <Radio
                            checkedIcon={<IconLayoutStandard />}
                            icon={<IconLayoutStandard />}
                            inputProps={{ 'aria-label': t('Standard layout') }}
                        />
                    }
                    value='standard'
                />
                <FormControlLabel
                    control={
                        <Radio
                            checkedIcon={<IconLayoutCompact />}
                            icon={<IconLayoutCompact />}
                            inputProps={{ 'aria-label': t('Compact layout') }}
                        />
                    }
                    label=''
                    value='compact'
                />
                <FormControlLabel
                    control={
                        <Radio
                            checkedIcon={<IconLayoutList />}
                            icon={<IconLayoutList />}
                            inputProps={{ 'aria-label': t('List layout') }}
                        />
                    }
                    label=''
                    value='list'
                />
            </RadioGroup>
        </FormControl>
    );
};

export default LayoutControls;
