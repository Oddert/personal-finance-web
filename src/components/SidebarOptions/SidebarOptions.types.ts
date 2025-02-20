export interface IProps {
    permanent?: boolean;
    onClose: (args?: any) => void;
    onOpen: (args?: any) => void;
    open: boolean;
}
