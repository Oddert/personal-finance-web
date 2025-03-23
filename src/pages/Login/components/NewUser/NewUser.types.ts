export interface IProps {
    /**
     * @param isExistingUser True if the user is on the login page, false for sign up.
     */
    setIsExistingUser: (isExistingUser: boolean) => void;
}
