export interface IProps {
    containerSx?: any;
    headingProps: any;
    iconPosition?: 'start' | 'end';
    onChange: (value: string) => void;
    placeholder?: string;
    text: string;
    verticalCenter?: boolean;
}
