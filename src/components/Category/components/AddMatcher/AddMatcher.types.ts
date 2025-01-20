import { Category } from '../../../../types/Category.d';
import { Matcher } from '../../../../types/Matcher.d';

export interface IProps {
    categoryId: Category['id'];
    defaultOpen?: boolean;
    matcher?: Partial<Matcher>;
    onSubmit?: (matcher: Partial<Matcher>) => void;
}
