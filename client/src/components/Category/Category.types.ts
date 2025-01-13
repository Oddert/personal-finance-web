import type { Category as CategoryT } from '../../types/Category'
import { IDynamicCardLayoutModes } from '../../types/Common.types'
import type { Matcher as MatcherT } from '../../types/Matcher'

export interface IProps {
    category: CategoryT
    defaultOpenAddNew?: boolean
    defaultOpenMatcher?: Partial<MatcherT>
    onAddNewSubmit?: (matcher: Partial<MatcherT>) => any
    layout?: IDynamicCardLayoutModes
}
