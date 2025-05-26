import type { ICategory } from '../../types/Category.d';
import type { TDynamicCardLayoutModes } from '../../types/Common.types';
import type { IMatcher } from '../../types/Matcher.d';

export interface IProps {
    category: ICategory;
    defaultOpenAddNew?: boolean;
    defaultOpenMatcher?: Partial<IMatcher>;
    onAddNewSubmit?: (matcher: Partial<IMatcher>) => any;
    layout?: TDynamicCardLayoutModes;
}
