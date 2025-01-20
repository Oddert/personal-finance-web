import { ReactNode } from 'react';

import { IDynamicCardLayoutModes } from '../../types/Common.types';

export interface IProps {
    children: ReactNode[];
    layout: IDynamicCardLayoutModes;
}
