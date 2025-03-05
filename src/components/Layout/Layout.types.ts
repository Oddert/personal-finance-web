import { ReactElement } from 'react';

export interface IProps {
    children: ReactElement;
    requiresAuth?: boolean;
    returnAddr?: string;
}
