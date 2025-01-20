import type { Category as CategoryT } from '../../types/Category.d';
import type { IDynamicCardLayoutModes } from '../../types/Common.types';
import type { Matcher as MatcherT } from '../../types/Matcher.d';

export interface IProps {
    category: CategoryT;
    defaultOpenAddNew?: boolean;
    defaultOpenMatcher?: Partial<MatcherT>;
    onAddNewSubmit?: (matcher: Partial<MatcherT>) => any;
    layout?: IDynamicCardLayoutModes;
}
