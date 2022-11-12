import {KEYWORDS} from "./constants/keywords";
import {OPERATORS} from "./constants/operators";

export function tokenize(raw: string) {

    const length = raw.length
    let pos = 0

    let tokens = []

    const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789äüöß'

    let openParenthesis = 0
    let closedParenthesis = 0

    while (pos < length) {
        let currentChar = raw[pos]

        if (currentChar === " " || currentChar === "\n") {
            // Skip whitespace and line breaks
            pos++
        } else if (currentChar === "\"") {
            // if quoted string starts
            let token = ""
            pos++

            while (raw[pos] !== "\"" && raw[pos] !== '\n' && pos < length) {
                token += raw[pos]
                pos++
            }

            if (raw[pos] !== '"') {
                return {
                    error: "Unterminated string"
                }
            }
            pos++
            tokens.push({
                type: "value",
                value: token
            })
        } else if (!Number.isNaN(Number(currentChar))) {
            // if number starts
            let token = currentChar
            pos++

            while (!Number.isNaN(Number(raw[pos])) && pos < length) {
                token += raw[pos]
                pos++
            }

            tokens.push({
                type: "value",
                value: token
            })

        } else if (currentChar === currentChar.toUpperCase() && allowedChars.includes(currentChar)) {
            // if function starts
            let token = currentChar
            pos++

            // parse function name
            while (allowedChars.includes(raw[pos]) && raw[pos] !== "(" && pos < length) {
                token += raw[pos]
                pos++
            }

            tokens.push({
                type: "function",
                value: token
            })

            if (raw[pos] !== '(') {
                return {
                    error: "Expect function arguments for: " + token
                }
            } else {
                // parse argument
                pos++
                token = ""
                while ((allowedChars.includes(raw[pos]) || raw[pos] === ".") && raw[pos] !== ")" && pos < length) {
                    token += raw[pos]
                    pos++
                }

                if (raw[pos] !== ')') {
                    return {
                        error: "Unterminated parenthesis"
                    }
                }

                pos++
                tokens.push({
                    type: "argument",
                    value: token
                })
            }
        } else if (allowedChars.includes(currentChar)) {
            // if unquoted string starts
            let token = currentChar
            pos++

            while ((allowedChars.includes(raw[pos]) || raw[pos] === ".") && pos < length) {
                token += raw[pos]
                pos++
            }

            if (Object.values(KEYWORDS).includes(token as KEYWORDS)) {
                // if unquoted string is a keyword
                tokens.push({
                    type: "keyword",
                    value: token
                })
            } else if ([OPERATORS.AND.toString(), OPERATORS.OR.toString()].includes(token)) {
                // if unquoted string is a logical operator
                tokens.push({
                    type: "operator",
                    value: token
                })
            } else {
                // if unquoted string is a variable name
                tokens.push({
                    type: "variable",
                    value: token
                })
            }
        } else if (currentChar === "*") {
            // if currentChar is the "everything" identifier
            pos++
            tokens.push({
                type: "variable",
                value: "*"
            })
        } else if (["<", ">", "="].includes(currentChar)) {
            let token = currentChar
            pos++

            if (raw[pos] == "=" && pos < length) {
                token += raw[pos]
                pos++
            }

            tokens.push({
                type: "operator",
                value: token
            })
        } else if (["(", ")"].includes(currentChar)) {
            if ("(" === currentChar) {
                openParenthesis++
                tokens.push({
                    type: "group_start",
                    value: currentChar
                })
            } else {
                closedParenthesis++
                tokens.push({
                    type: "group_end",
                    value: currentChar
                })
            }
            pos++
        }
        else { // we have an invalid character in our code
            return {
                error: `Unexpected character ${raw[pos]}`
            }
        }
    }

    if (openParenthesis !== closedParenthesis) {
        return {
            error: "Unterminated parenthesis"
        }
    }

    return {
        error: false,
        tokens
    }
}
