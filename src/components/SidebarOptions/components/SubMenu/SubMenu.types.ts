import type { INavigationOption } from '../../../../constants/routerConstants';

export interface IProps {
    navItem: INavigationOption;
    onClose: () => void;
    onOpen: () => void;
    open: boolean;
    permanent?: boolean;
}
