import { FC } from 'react';

import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import {
    Window as LayoutStandardIcon,
    Apps as LayoutCompactIcon,
    TableRows as LayoutListIcon,
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
    return (
        <FormControl>
            <RadioGroup
                aria-label='Layout'
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
                    value='standard'
                    control={
                        <Radio
                            checkedIcon={<LayoutStandardIcon />}
                            icon={<LayoutStandardIcon />}
                            inputProps={{ 'aria-label': 'Standard layout' }}
                        />
                    }
                    label=''
                />
                <FormControlLabel
                    value='compact'
                    control={
                        <Radio
                            checkedIcon={<LayoutCompactIcon />}
                            icon={<LayoutCompactIcon />}
                            inputProps={{ 'aria-label': 'Compact layout' }}
                        />
                    }
                    label=''
                />
                <FormControlLabel
                    value='list'
                    control={
                        <Radio
                            checkedIcon={<LayoutListIcon />}
                            icon={<LayoutListIcon />}
                            inputProps={{ 'aria-label': 'List layout' }}
                        />
                    }
                    label=''
                />
            </RadioGroup>
        </FormControl>
    );
};

export default LayoutControls;
