import {OPERATORS} from "../constants/operators";
import {Variable} from "./variable";
import {QlFunction} from "./qlFunction";

export interface Group {
    expression: (Value | Variable | QlFunction | OPERATORS)[],
    subgroupOperator: OPERATORS | null,
    subgroup: Group | null
}
