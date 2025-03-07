/**
 * Validation function, compares two password strings.
 * @param pwd1 The first password.
 * @param pwd2 The second, validation password.
 * @returns An error message or null.
 */
export const comparePasswords = (pwd1: string, pwd2: string) => {
    if (pwd1.trim() !== pwd2.trim()) {
        return 'auth.passwordsDontMatch';
    }
    return null;
};

/**
 * Validation function, compares password strength against minimum requirements rules.
 *
 * NOTE: Possibly swap out for individual rules with better feedback.
 * @param password
 * @returns An error message or null.
 */
export const passwordStrength = (password: string) => {
    let response = null;
    if (!/[0-9]/g.test(password)) {
        response = 'auth.passwordsMustHaveOneNumber';
    }
    if (password.trim().length < 5) {
        response = 'auth.passwordsMustBeXLong';
    }
    return response;
};
