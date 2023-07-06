export const createTransactionSchema = {
    date: {
        isString: true,
        exists: { errorMessage: 'Field "date" is required.' },
        errorMessage: '"date" is invalid. Please ensure date is a string of at least 6 characters.',
        isLength: {
            options: {
                min: 6,
            },
        },
    },
    transaction_type: {
        isString: true,
        exists: { errorMessage: 'Field "transaction_type" is required.' },
        errorMessage: '"transaction_type" is invalid. Please ensure match_type is a 3 character string.',
        isLength: {
            errorMessage: 'Length error. "match_type" must be 3 characters long.',
            options: {
                min: 3,
                max: 3,
            },
        },
    },
    description: {
        isString: true,
        optional: true,
        errorMessage: '"description" is invalid. Please ensure description is a string.',
    },
    debit: {
        isNumeric: true,
        exists: { errorMessage: 'Field "debit" is invalid.' },
        errorMessage: '"debit" is invalid. Please ensure debit is a number.',
    },
    credit: {
        isNumeric: true,
        exists: { errorMessage: 'Field "credit" is invalid.' },
        errorMessage: '"credit" is invalid. Please ensure credit is a number.',
    },
    ballance: {
        isNumeric: true,
        exists: { errorMessage: 'Field "ballance" is invalid.' },
        errorMessage: '"ballance" is invalid. Please ensure debit is a number.',
    },
    category: {
        isNumeric: true,
        optional: true,
        errorMessage: '"category" is invalid. Please ensure category is a valid integer ID.',
    },
}

export const updateTransactionSchema = { ...createTransactionSchema }

export const createManyTransactionSchema = {
    'transactions.*.date': {
        isString: true,
        exists: { errorMessage: 'Field "date" is required.' },
        errorMessage: '"date" is invalid. Please ensure date is a string of at least 6 characters.',
        isLength: {
            options: {
                min: 6,
            },
        },
    },
    'transactions.*.transaction_type': {
        isString: true,
        exists: { errorMessage: 'Field "transaction_type" is required.' },
        errorMessage: '"transaction_type" is invalid. Please ensure match_type is a 3 character string.',
        isLength: {
            errorMessage: 'Length error. "match_type" must be 3 characters long.',
            options: {
                min: 3,
                max: 3,
            },
        },
    },
    'transactions.*.description': {
        isString: true,
        optional: true,
        errorMessage: '"description" is invalid. Please ensure description is a string.',
    },
    'transactions.*.debit': {
        isNumeric: true,
        exists: { errorMessage: 'Field "debit" is invalid.' },
        errorMessage: '"debit" is invalid. Please ensure debit is a number.',
    },
    'transactions.*.credit': {
        isNumeric: true,
        exists: { errorMessage: 'Field "credit" is invalid.' },
        errorMessage: '"credit" is invalid. Please ensure credit is a number.',
    },
    'transactions.*.ballance': {
        isNumeric: true,
        exists: { errorMessage: 'Field "ballance" is invalid.' },
        errorMessage: '"ballance" is invalid. Please ensure debit is a number.',
    },
    'transactions.*.category': {
        isNumeric: true,
        optional: true,
        errorMessage: '"category" is invalid. Please ensure category is a valid integer ID.',
    },
}
