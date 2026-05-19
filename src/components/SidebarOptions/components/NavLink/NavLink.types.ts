import type { INavigationOption } from '../../../../constants/routerConstants';

export interface IProps {
    navItem: INavigationOption;
    isChild?: boolean;
    onClose: () => void;
    open: boolean;
    permanent?: boolean;
}
