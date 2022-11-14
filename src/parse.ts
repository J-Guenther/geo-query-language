import {Select} from "./models/select";
import {Expression} from "./models/expression";
import {Operators} from "./constants/operators";
import {TokenTypes} from "./constants/tokenTypes";
import {TokenType} from "./models/tokenType";
import {Value} from "./models/value";
import {GeoQLFunction} from "./models/geoQLFunction";
import {Variable} from "./models/variable";

export function parse(tokens: TokenType[]) {
    const select: Select = {apply: null, columns: null, from: {as: null, table: null}, where: null}

    const len = tokens.length
    let pos = 0
    while (pos < len) {
        const token = tokens[pos]

        if (pos == 0 && token.value !== "select") {
            throw new Error('Statement needs to start with select')
        }

        if (token.type === TokenTypes.KEYWORD) {
            if (token.value === "select") {
                if (select.columns) {
                    throw new Error('Found unexpected use of select')
                }
                pos++
                if (tokens[pos].type !== TokenTypes.VARIABLE) {
                    throw new Error(`Unexpected token ${tokens[pos].type}, expected column name or *`)
                }

                if (tokens[pos].value === "*") {
                    select.columns = tokens[pos].value as "*"
                    pos ++
                } else {
                    select.columns = []
                    while (pos < len && (tokens[pos].type === TokenTypes.SEPARATOR || tokens[pos].type === TokenTypes.VARIABLE)) {

                        if (tokens[pos].value === "*") {
                            throw new Error("Expected specific column name, not *")
                        }

                        if (tokens[pos].type === TokenTypes.VARIABLE) {
                            select.columns.push(tokens[pos].value)
                        }
                        pos++
                    }
                }
            } else if (token.value === "from") {
                if (select.from.table || select.where?.tokenValues.length > 0 || !select.columns) {
                    throw new Error('Found unexpected use of from')
                }
                if (tokens[pos + 1].type !== TokenTypes.VARIABLE) {
                    throw new Error(`Unexpected token ${tokens[pos + 1].type}, expected field name`)
                }

                select.from.table = {value: tokens[pos + 1].value}

                pos += 2

            } else if (token.value === "where") {
                if (select.where || !select.columns || !select.from.table) {
                    throw new Error('Found unexpected use of where')
                }
                if (tokens[pos + 1].type !== TokenTypes.VARIABLE &&
                    tokens[pos + 1].type !== TokenTypes.VALUE &&
                    tokens[pos + 1].type !== TokenTypes.FUNCTION) {
                    throw new Error(`Unexpected token ${tokens[pos + 1].type}, expected field name, value or function`)
                }

                pos++
                const parsedResult = parseExpression(pos, len, tokens, false);
                pos = parsedResult.pos
                select.where = parsedResult.expression
            }
        } else {
            throw new Error(`Unexpected token ${token.type}`)
        }
    }

    return select
}

function parseExpression(pos: number, len: number, tokens: TokenType[], sub: boolean) {

    const expression: Expression = new Expression([])

    while (pos < len && tokens[pos].type != TokenTypes.KEYWORD) {
        let currentToken = tokens[pos]
        if (currentToken.type === TokenTypes.VARIABLE) {
            expression.tokenValues.push(new Variable(currentToken.value))
        } else if (currentToken.type === TokenTypes.OPERATOR) {
            const indexOfValueInEnum = Object.values(Operators).indexOf(currentToken.value as Operators)
            const key = Object.keys(Operators)[indexOfValueInEnum]
            expression.tokenValues.push(Operators[key])
        } else if (currentToken.type === TokenTypes.VALUE) {
            let x
            if (isNumber(currentToken.value)) {
                x = Number(currentToken.value)
            } else {
                x = currentToken.value
            }
            expression.tokenValues.push(new Value(x))
        } else if (currentToken.type === TokenTypes.FUNCTION) {
            const functionName = currentToken.value
            pos++
            if (tokens[pos].type !== TokenTypes.ARGUMENT) {
                throw Error('Function has no arguments')
            }
            const functionArgument = tokens[pos].value
            expression.tokenValues.push(new GeoQLFunction(functionName, functionArgument))
        } else if (currentToken.type === TokenTypes.GROUP_START) {

            if (tokens[pos - 1].type !== TokenTypes.OPERATOR) {
                throw Error("There needs to be an operator before an opening parenthesis")
            }

            pos++
            const parsedSubExpression = parseExpression(pos, len, tokens, true)
            pos = parsedSubExpression.pos
            expression.tokenValues.push(parsedSubExpression.expression)
        } else if ((currentToken.type === TokenTypes.GROUP_END)) {
            pos++
            return {pos, expression};
        } else {
            throw Error('Found unexpected token in where clause')
        }
        pos++
    }
    if (sub) {
        throw Error("Missing closing parenthesis")
    }
    return {pos, expression};
}

function isNumber(str: string): boolean {
    if (typeof str !== 'string') {
        return false;
    }

    if (str.trim() === '') {
        return false;
    }

    return !Number.isNaN(Number(str));
}
