export interface Expression {
    hierarchy: number
    value1: number | string | Expression
    value2: number | string | Expression
    operator: "<"
}
