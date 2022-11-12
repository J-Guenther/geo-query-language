import {Variable} from "./variable";
import {Group} from "./group";

export interface Select {
    columns: [string] | "*",
    from: {
        "table": Variable,
        "as": string | null
    },
    "where": Group | null,
    "apply": string | null
}
