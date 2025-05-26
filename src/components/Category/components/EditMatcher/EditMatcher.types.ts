import { IMatcher } from '../../../../types/Matcher.d';

export interface IProps {
    clearOnBlur?: boolean;
    clearOnCancel: boolean;
    clearOnSubmit: boolean;
    matcher?: Partial<IMatcher>;
    onBlur?: (matcher: Partial<IMatcher>) => void;
    onCancel?: (matcher: Partial<IMatcher>) => void;
    onSubmit?: (matcher: Partial<IMatcher>) => void;
}
