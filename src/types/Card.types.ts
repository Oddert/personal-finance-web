export type ICardTypes = 'OTHER' | 'DEBIT' | 'CREDIT';

export interface ICard {
    id: number;
    isDefault: boolean;
    cardName: string;
    cardType: ICardTypes;
    bankName: string;
    sortCode: number;
    cardNumber: number;
    expires: number;
    description: string;
    icon: string;
    coverImage: string;
    createdOn: string;
    updatedOn: string;
}
