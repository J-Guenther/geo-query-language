import {Operators} from "../constants/operators";
import {Variable} from "./variable";
import {QlFunction} from "./qlFunction";

export interface Expression {
    tokenValues: (Value | Variable | QlFunction | Operators | Expression)[],
}
