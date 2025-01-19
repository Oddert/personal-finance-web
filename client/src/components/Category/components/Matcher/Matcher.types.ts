
import type { Category } from '../../../../types/Category'
import type { Matcher as MatcherT } from '../../../../types/Matcher'

export interface IProps {
    matcher: MatcherT
    categoryId: Category['id']
}
