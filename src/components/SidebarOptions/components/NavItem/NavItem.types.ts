import { INavigationOption } from '../../../../constants/routerConstants';

export interface IProps {
    index: number;
    navItem: INavigationOption;
    onClose: (args?: any) => void;
    open: boolean;
    permanent?: boolean;
}
