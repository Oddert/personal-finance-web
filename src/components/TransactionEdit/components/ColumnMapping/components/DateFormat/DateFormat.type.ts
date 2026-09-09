import type { Dispatch, SetStateAction } from 'react';

export interface IProps {
    localDateFormat: string;
    setLocalDateFormat: Dispatch<SetStateAction<string>>;
}
