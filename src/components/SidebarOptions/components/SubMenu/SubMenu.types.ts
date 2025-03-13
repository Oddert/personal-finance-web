import { INavigationOption } from '../../../../constants/routerConstants';

export interface IProps {
    navItem: INavigationOption;
    onClose: (args?: any) => void;
    onOpen: (args?: any) => void;
    open: boolean;
    permanent?: boolean;
}
