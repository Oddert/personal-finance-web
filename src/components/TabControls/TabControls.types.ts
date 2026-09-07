import type { SyntheticEvent } from 'react';

export interface IProps<TTab extends string | number = string | number> {
    /** Hidden Aria Label attached to the tab container to describe its use. */
    containerAriaLabel: string;
    /** Callback function invoked when the controls request to change the tab. */
    onChange: (_: SyntheticEvent, nextTab: TTab) => void;
    /** List of tab options to display in order. */
    options: { label: string; value: TTab }[];
    /** Prefix used across this component and {@link TabPanel}. Not visible to the user. Implements accessibility requirements by linking the tab and content. */
    panelPrefix: string;
    /** The current selected tab value. */
    tab: TTab;
}
