import { ReactNode } from 'react';

import { TDynamicCardLayoutModes } from '../../types/Common.types';

export interface IProps {
    children: ReactNode | ReactNode[];
    layout: TDynamicCardLayoutModes;
}
