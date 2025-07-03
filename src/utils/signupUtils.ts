/**
 * Validation function, compares two password strings.
 *
 * By default, returns an error if the passwords do not match.
 * @param password1 The first password.
 * @param password2 The second, validation password.
 * @param shouldNotMatch If true, the function will be 'inverted', requiring the passwords to be distinct.
 * @returns An error message or null.
 */
export const comparePasswords = (
    password1: string,
    password2: string,
    shouldNotMatch?: boolean,
) => {
    const pwd1 = password1.trim();
    const pwd2 = password2.trim();
    if (shouldNotMatch) {
        if (pwd1 === pwd2) {
            return 'auth.passwordsShouldNoMatch';
        }
        return null;
    }
    if (pwd1 !== pwd2) {
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
    if (password.trim().length < 8) {
        response = 'auth.passwordsMustBeXLong';
    }
    return response;
};

/**
 * Performs various tests on an email to confirm its validity.
 * @param email
 * @returns An error message or null.
 */
export const emailValidator = (email: string) => {
    let response = null;
    if (email.trim().length < 4) {
        response = 'auth.emailMustBeXLong';
    }
    if (!/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
        response = 'auth.emailFormatInvalid';
    }
    return response;
};
