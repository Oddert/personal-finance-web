import { Matcher } from './Matcher'

export declare interface Category {
    id: number
    label: string
    description: string
    colour: string
    created_on: string
    updated_on: string
    matchers: Matcher[]
}

export declare type ICategoryLayoutModes = 'standard'|'compact'|'list';
