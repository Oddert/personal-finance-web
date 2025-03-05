import { Dispatch, SetStateAction } from 'react';

export interface IProps {
    /**
     * @param isExistingUser True if the user is on the login page, false for sign up.
     */
    setIsExistingUser: (isExistingUser: boolean) => void;
}

/**
 * A collection of a dispatch action and 0 or more validation functions to be called.
 */
export type IValidationSet = [
    Dispatch<SetStateAction<string | null>>,
    (() => string | null)[],
];

/**
 * A collection of validation sets by validation ares e.g. "username", "password".
 */
export type IValidationMap = {
    [key: string]: IValidationSet;
};
