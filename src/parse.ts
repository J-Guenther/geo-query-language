import {Select} from "./models/select";

export function parse(tokens: { type: string, value: string }[]) {
    const select: Select = {apply: null, columns: null, from: {as: null, table: ""}, where: ""}

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

                select.from.table = tokens[pos + 1].value

                pos += 2

            } else if (token.value === "where") {
                if (select.where) {
                    return console.log('Found unexpected use of where')
                }
                if (tokens[pos + 1].type !== "variable") {
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected field name or function`)
                }

                pos++

                while (pos < len && tokens[pos].type != "keyword") {
                    console.log(tokens[pos])
                    select.where += tokens[pos].value
                    pos++
                }
            }
        } else {
            return console.log(`Unexpected token ${token.type}`)
        }
    }

    return select
}
