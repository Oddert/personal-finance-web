import { MouseEvent } from 'react';

export interface IProps {
    asButton: boolean;
    colour: string;
    handleClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    id?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
