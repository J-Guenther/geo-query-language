import {Keywords} from "./constants/keywords";
import {Operators} from "./constants/operators";
import {TokenTypes} from "./constants/tokenTypes";
import {TokenType} from "./models/tokenType";

export function tokenize(raw: string): Error | {tokens: TokenType[]} {

    const length = raw.length
    let pos = 0

    let tokens: TokenType[] = []

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
                throw new Error("Unterminated string")
            }
            pos++
            tokens.push({
                type: TokenTypes.VALUE,
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
                type: TokenTypes.VALUE,
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
                type: TokenTypes.FUNCTION,
                value: token
            })

            if (raw[pos] !== '(') {
                throw new Error("Expect function arguments for: " + token)
            } else {
                // parse argument
                pos++
                token = ""
                while ((allowedChars.includes(raw[pos]) || raw[pos] === ".") && raw[pos] !== ")" && pos < length) {
                    token += raw[pos]
                    pos++
                }

                if (raw[pos] !== ')') {
                    throw new Error("Unterminated parenthesis")
                }

                pos++
                tokens.push({
                    type: TokenTypes.ARGUMENT,
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

            if (Object.values(Keywords).includes(token as Keywords)) {
                // if unquoted string is a keyword
                tokens.push({
                    type: TokenTypes.KEYWORD,
                    value: token
                })
            } else if ([Operators.AND.toString(), Operators.OR.toString()].includes(token)) {
                // if unquoted string is a logical operator
                tokens.push({
                    type: TokenTypes.OPERATOR,
                    value: token
                })
            } else {
                // if unquoted string is a variable name
                tokens.push({
                    type: TokenTypes.VARIABLE,
                    value: token
                })
            }
        } else if (currentChar === "*") {
            // if currentChar is the "everything" identifier
            pos++
            tokens.push({
                type: TokenTypes.VARIABLE,
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
                type: TokenTypes.OPERATOR,
                value: token
            })
        } else if (["(", ")"].includes(currentChar)) {
            if ("(" === currentChar) {
                openParenthesis++
                tokens.push({
                    type: TokenTypes.GROUP_START,
                    value: currentChar
                })
            } else {
                closedParenthesis++
                tokens.push({
                    type: TokenTypes.GROUP_END,
                    value: currentChar
                })
            }
            pos++
        }
        else { // we have an invalid character in our code
            throw new Error(`Unexpected character ${raw[pos]}`)
        }
    }

    if (openParenthesis !== closedParenthesis) {
        throw new Error("Unterminated parenthesis")
    }

    return {
        tokens
    }
}
