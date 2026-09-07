import { Tab, Tabs } from '@mui/material';

import type { IProps } from './TabControls.types';

const a11yProps = (panelPrefix: string, index: number | string) => ({
    'aria-controls': `${panelPrefix}-tabpanel-${String(index)}`,
    id: `${panelPrefix}-tab-${String(index)}`,
});

/**
 * Displays a list of tab controls.
 *
 * Links with {@link TabPanel} for out-the-box accessibility.
 * @component
 * @category Components
 * @subcategory Tab
 */
const TabControls = <TTab extends string | number = string | number>({
    containerAriaLabel,
    onChange,
    options,
    panelPrefix,
    tab,
}: IProps<TTab>) => {
    return (
        <Tabs aria-label={containerAriaLabel} onChange={onChange} value={tab}>
            {options.map(({ label, value }, idx) => (
                <Tab
                    key={idx}
                    label={label}
                    value={value}
                    {...a11yProps(panelPrefix, value)}
                />
            ))}
        </Tabs>
    );
};

export default TabControls;
