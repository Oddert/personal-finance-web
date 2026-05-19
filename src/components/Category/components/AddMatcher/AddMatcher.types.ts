import type { ICategory } from '../../../../types/Category.d';
import type { IMatcher } from '../../../../types/Matcher.d';

export interface IProps {
    categoryId: ICategory['id'];
    defaultOpen?: boolean;
    matcher?: Partial<IMatcher>;
    onSubmit?: (matcher: Partial<IMatcher>) => void;
}
