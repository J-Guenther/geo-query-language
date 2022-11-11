export interface Select {
    columns: [string] | "*",
    from: {
        "table": string,
        "as": string | null
    },
    "where": string | null,
    "apply": string | null
}