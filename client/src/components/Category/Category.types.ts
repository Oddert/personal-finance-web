import type { Category as CategoryT, ICategoryLayoutModes } from '../../types/Category'
import type { Matcher as MatcherT } from '../../types/Matcher'

export interface IProps {
    category: CategoryT
    defaultOpenAddNew?: boolean
    defaultOpenMatcher?: Partial<MatcherT>
    onAddNewSubmit?: (matcher: Partial<MatcherT>) => any
    layout?: ICategoryLayoutModes
}
