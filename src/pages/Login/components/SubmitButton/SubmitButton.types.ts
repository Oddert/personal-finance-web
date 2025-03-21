import { SyntheticEvent } from 'react';

export interface IProps {
    loading: boolean;
    onSubmit: (event: SyntheticEvent) => void;
    submitDisabled: boolean;
    success: boolean;
    text: string;
}
