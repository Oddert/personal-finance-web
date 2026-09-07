export type ICardTypes = 'OTHER' | 'DEBIT' | 'CREDIT';

/**
 * Represents a single bank card, account, or other cash value store (e.g. a physical wallet).
 * @category Types
 * @subcategory Card
 */
export interface ICard {
    /** Name of the bank or wider organisation. */
    bankName: string;
    /** Readable card / account name. */
    cardName: string;
    /** The card number. */
    cardNumber: number;
    /** Card / account type. */
    cardType: ICardTypes;
    /** Card background image. */
    coverImage: string;
    /** ISO timestamp of the date/time the record was first created. */
    createdOn: string;
    /** user-defined description of the card and its purpose. */
    description: string;
    /** ISO timestamp of the date of expiry. */
    expires: string;
    /** Small card icon. */
    icon: string;
    /** Unique identifier. */
    id: string;
    /** True if this Card is selected by default. */
    isDefault: boolean;
    /** The card sort code. */
    sortCode: number;
    /** ISO timestamp of most recent save. */
    updatedOn: string;
}
