import { TDynamicCardLayoutModes } from '../../types/Common.types';

export interface IProps {
    layout: TDynamicCardLayoutModes;
    setLayout: (value: TDynamicCardLayoutModes) => void;
}
