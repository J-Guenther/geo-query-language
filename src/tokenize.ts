export function tokenize(raw: string) {


    const length = raw.length
    let pos = 0

    let tokens = []
    const BUILT_IN_KEYWORDS = ["select", "from", "where"]

    const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789äüöß'

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

        } else if (allowedChars.includes(currentChar)) {
            // if unquoted string starts
            let token = currentChar
            pos++

            while ((allowedChars.includes(raw[pos]) || raw[pos] === ".") && pos < length) {
                // adding the char to the string
                token += raw[pos]
                pos++
            }

            if (BUILT_IN_KEYWORDS.includes(token)) {
                tokens.push({
                    type: "keyword",
                    value: token
                })
            } else {
                tokens.push({
                    type: "variable",
                    value: token
                })
            }
        } else if (currentChar === "*") {
            pos++
            tokens.push({
                type: "value",
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
        } else { // we have an invalid character in our code
            return {
                error: `Unexpected character ${raw[pos]}`
            }
        }
    }
    return {
        error: false,
        tokens
    }
}