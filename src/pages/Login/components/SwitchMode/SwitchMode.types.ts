export interface IProps {
    /**
     * True if the user is on the "Login" page, false for "Sign Up".
     */
    isExisting: boolean;
    /**
     * @param isExistingUser True if the user is on the login page, false for sign up.
     */
    setIsExistingUser: (isExistingUser: boolean) => void;
}
