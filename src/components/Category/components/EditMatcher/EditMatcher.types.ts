import { Matcher } from '../../../../types/Matcher.d';

export interface IProps {
    clearOnBlur?: boolean;
    clearOnCancel: boolean;
    clearOnSubmit: boolean;
    matcher?: Partial<Matcher>;
    onBlur?: (matcher: Partial<Matcher>) => void;
    onCancel?: (matcher: Partial<Matcher>) => void;
    onSubmit?: (matcher: Partial<Matcher>) => void;
}
