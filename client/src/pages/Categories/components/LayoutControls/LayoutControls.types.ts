import { ICategoryLayoutModes } from '../../../../types/Category';

export interface IProps {
    layout: ICategoryLayoutModes
    setLayout: (value: ICategoryLayoutModes) => void
}
