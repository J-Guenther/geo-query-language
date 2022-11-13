import {Select} from "./models/select";
import {Group} from "./models/group";
import {Operators} from "./constants/operators";
import {TokenTypes} from "./constants/tokenTypes";
import {TokenType} from "./models/tokenType";

export function parse(tokens: TokenType[]) {
    const select: Select = {apply: null, columns: null, from: {as: null, table: null}, where: null}

    const len = tokens.length
    let pos = 0
    while (pos < len) {
        const token = tokens[pos]
        console.log(token)
        if (token.type === TokenTypes.KEYWORD) {
            if (token.value === "select") {
                if (select.columns) {
                    return console.log('Found unexpected use of select')
                }
                if (tokens[pos + 1].type !== TokenTypes.VARIABLE) {
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected column name or *`)
                }

                if (tokens[pos + 1].value === "*") {
                    select.columns = tokens[pos + 1].value as "*"
                } else {
                    select.columns = [tokens[pos + 1].value]
                }

                pos += 2
            } else if (token.value === "from") {
                if (select.from.table) {
                    return console.log('Found unexpected use of from')
                }
                if (tokens[pos + 1].type !== TokenTypes.VARIABLE) {
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected field name`)
                }

                select.from.table = {value: tokens[pos + 1].value}

                pos += 2

            } else if (token.value === "where") {
                console.log("WHERE!")
                if (select.where) {
                    return console.log('Found unexpected use of where')
                }
                if (tokens[pos + 1].type !== TokenTypes.VARIABLE &&
                    tokens[pos + 1].type !== TokenTypes.VALUE &&
                    tokens[pos + 1].type !== TokenTypes.FUNCTION) {
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected field name, value or function`)
                }

                pos++
                const group: Group = {
                    expression: [], subgroup: null, subgroupOperator: null
                }

                while (pos < len && tokens[pos].type != TokenTypes.KEYWORD) {
                    let currentToken = tokens[pos]
                    if (currentToken.type === TokenTypes.VARIABLE) {
                        group.expression.push({value: currentToken.value})
                    } else if (currentToken.type === TokenTypes.OPERATOR) {
                        const indexOfValueInEnum = Object.values(Operators).indexOf(currentToken.value as Operators)
                        const key = Object.keys(Operators)[indexOfValueInEnum]
                        group.expression.push(Operators[key])
                    } else if(currentToken.type === TokenTypes.VALUE) {
                        let x
                        if (isNumber(currentToken.value)) {
                            x = Number(currentToken.value)
                        } else {
                            x = currentToken.value
                        }
                        group.expression.push({x: x})
                    } else if (currentToken.type === TokenTypes.FUNCTION) {
                        const functionName = currentToken.value
                        pos++
                        if (tokens[pos].type !== TokenTypes.ARGUMENT) {
                            return console.log('Function has no arguments')
                        }
                        const functionArgument = tokens[pos].value
                        group.expression.push({name: functionName, argument: functionArgument})
                    } else {
                        return console.log('Found unexpected token in where clause')
                    }

                    pos++
                }
                select.where = group
            }
        } else {
            return console.log(`Unexpected token ${token.type}`)
        }
    }

    return select
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
