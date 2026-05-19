export interface IProps {
    handleClose: (
        payload?: null | {
            label: string;
            description: string;
            colour: string;
            matchers: never[];
        },
    ) => void;
    open: boolean;
}
