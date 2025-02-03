export interface IProps {
    label: string;
    onConfirmChange: (url: string | null) => void;
    size: 'sm' | 'md';
    url: string | null;
}
