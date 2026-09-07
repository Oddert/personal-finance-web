export interface IProps<TTab extends string | number = string | number> {
    children?: React.ReactNode;
    index: TTab;
    panelPrefix: string;
    tab: TTab;
}
