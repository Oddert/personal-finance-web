import { INavigationOption } from '../../../../constants/routerConstants';

export interface IProps {
    navItem: INavigationOption;
    isChild?: boolean;
    onClose: (args?: any) => void;
    open: boolean;
    permanent?: boolean;
}
