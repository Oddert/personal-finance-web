import { ReactNode } from 'react';

import { ICategoryLayoutModes } from '../../types/Category';

export interface IProps {
	children: ReactNode[]
	layout: ICategoryLayoutModes
}
