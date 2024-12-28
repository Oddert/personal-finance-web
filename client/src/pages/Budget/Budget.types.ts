export interface ICategoryBDValue {
    value: number
    label: string
    colour: string
}

export interface ICategoryBreakdown {
    [key: number|string]: ICategoryBDValue
}
