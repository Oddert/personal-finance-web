import { Category } from '../../../../types/Category';
import { Matcher } from '../../../../types/Matcher';

export interface IProps {
    categoryId: Category['id'];
    defaultOpen?: boolean;
    matcher?: Partial<Matcher>;
    onSubmit?: (matcher: Partial<Matcher>) => void;
}
