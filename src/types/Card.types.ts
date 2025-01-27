export interface ICard {
    id: number;
    isDefault: boolean;
    cardName: string;
    cardType: 'OTHER' | 'DEBIT' | 'CREDIT';
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
