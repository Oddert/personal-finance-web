import type { Dispatch, SetStateAction } from 'react';

export interface IProps {
    localColumnMap: Record<string, string>;
    setLocalColumnMap: Dispatch<SetStateAction<Record<string, string>>>;
}
