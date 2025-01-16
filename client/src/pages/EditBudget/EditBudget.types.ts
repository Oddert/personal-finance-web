import { IBudgetRow } from "../../types/Budget.types";

export interface IProps {}

export type IBudgetRowEditable = IBudgetRow & { staged: boolean, deleted: boolean, colour: string }
