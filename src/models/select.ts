import {Variable} from "./variable";
import {Expression} from "./expression";

export class Select {
    columns: string[] | "*"
    from: {
        "table": Variable,
        "as": string | null
    }
    where: Expression | null
    apply: string | null
}
