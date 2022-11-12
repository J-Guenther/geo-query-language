import {Select} from "./models/select";
import {Group} from "./models/group";
import {OPERATORS} from "./constants/operators";

export function parse(tokens: { type: string, value: string }[]) {
    const select: Select = {apply: null, columns: null, from: {as: null, table: null}, where: null}

    const len = tokens.length
    let pos = 0
    while (pos < len) {
        const token = tokens[pos]
        console.log(token)
        if (token.type === "keyword") {
            if (token.value === "select") {
                if (select.columns) {
                    return console.log('Found unexpected use of select')
                }
                if (tokens[pos + 1].type !== "variable") {
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
                if (tokens[pos + 1].type !== "variable") {
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected field name`)
                }

                select.from.table = {value: tokens[pos + 1].value}

                pos += 2

            } else if (token.value === "where") {
                console.log("WHERE!")
                if (select.where) {
                    return console.log('Found unexpected use of where')
                }
                if (tokens[pos + 1].type !== "variable") {
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected field name or function`)
                }

                pos++
                const group: Group = {
                    expression: [], subgroup: null, subgroupOperator: null
                }

                while (pos < len && tokens[pos].type != "keyword") {
                    if (tokens[pos].type === "variable") {
                        group.expression.push({value: tokens[pos].value})
                    } else if (tokens[pos].type === "operator") {
                        const indexOfValueInEnum = Object.values(OPERATORS).indexOf(tokens[pos].value as OPERATORS)
                        const key = Object.keys(OPERATORS)[indexOfValueInEnum]
                        group.expression.push(OPERATORS[key])
                    } else if(tokens[pos].type === "value") {
                        let x
                        if (isNumber(tokens[pos].value)) {
                            x = Number(tokens[pos].value)
                        } else {
                            x = tokens[pos].value
                        }
                        group.expression.push({x: x})
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
