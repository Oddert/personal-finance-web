export interface IProps {
    permanent?: boolean;
    onClose: () => void;
    onOpen: () => void;
    open: boolean;
}
