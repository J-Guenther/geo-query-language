import {Operators} from "../constants/operators";
import {Variable} from "./variable";
import {QlFunction} from "./qlFunction";

export interface Group {
    expression: (Value | Variable | QlFunction | Operators)[],
    subgroupOperator: Operators | null,
    subgroup: Group | null
}
