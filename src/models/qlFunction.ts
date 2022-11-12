import {Variable} from "./variable";

export interface QlFunction {
    name: string
    argument: string | number | Variable
}
