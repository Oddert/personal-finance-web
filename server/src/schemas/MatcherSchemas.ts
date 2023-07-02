export const createMatcherSchema = {
    match: {
        isString: true,
        exists: { errorMessage: 'Field "match" is required.' },
        errorMessage: '"match" is invalid. Please ensure match is a string of at least 3 characters.',
        isLength: {
            options: {
                min: 3,
            },
        },
    },
    match_type: {
        isString: true,
        exists: { errorMessage: 'Field "match_type" is required.' },
        errorMessage: '"match_type" is invalid. Please ensure match_type is a string of at least 3 characters.',
        isLength: {
            errorMessage: 'Length error. "match_type" must be at least 3 characters long.',
            options: {
                min: 3,
            },
        },
    },
    case_sensitive: {
        exists: { errorMessage: 'Field "case_sensitive" is required.' },
        errorMessage: '"case_sensitive" is invalid. Please ensure case_sensitive is a boolean value.',
        isIn: {
            errorMessage: '"case_sensitive" is invalid. Please ensure case_sensitive is a boolean value.',
            options: [true, false, 1, 0],
        },
    },
}

export const updateMatcherSchema = { ...createMatcherSchema }

export const createManyMatchersSchema = {
    'matchers.*.match': {
        isString: true,
        exists: { errorMessage: 'Field "match" is required.' },
        errorMessage: '"match" is invalid. Please ensure match is a string of at least 3 characters.',
        isLength: {
            options: {
                min: 3,
            },
        },
    },
    'matchers.*.match_type': {
        isString: true,
        exists: { errorMessage: 'Field "match_type" is required.' },
        errorMessage: '"match_type" is invalid. Please ensure match_type is a string of at least 3 characters.',
        isLength: {
            errorMessage: 'Length error. "match_type" must be at least 3 characters long.',
            options: {
                min: 3,
            },
        },
    },
    'matchers.*.case_sensitive': {
        exists: { errorMessage: 'Field "case_sensitive" is required.' },
        errorMessage: '"case_sensitive" is invalid. Please ensure case_sensitive is a boolean value.',
        isIn: {
            errorMessage: '"case_sensitive" is invalid. Please ensure case_sensitive is a boolean value.',
            options: [true, false, 1, 0],
        },
    },
}
