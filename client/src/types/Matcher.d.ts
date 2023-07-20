export declare interface Matcher {
    id: number,
    match: string,
    match_type: 'exact'|'start'|'end'|'any',
    case_sensitive: boolean|1|0,
    created_on: string,
    updated_on: string,
}
