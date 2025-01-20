import type { Category } from '../../../../types/Category.d';
import type { Matcher as MatcherT } from '../../../../types/Matcher.d';

export interface IProps {
    matcher: MatcherT;
    categoryId: Category['id'];
}
