import type { ICategory } from '../../../../types/Category.d';
import type { IMatcher } from '../../../../types/Matcher.d';

export interface IProps {
    matcher: IMatcher;
    categoryId: ICategory['id'];
}
