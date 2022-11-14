import {Variable} from "./variable";

export class GeoQLFunction {
    name: string
    argument: string | number | Variable

    constructor(name: string, argument: string | number | Variable) {
        this.name = name;
        this.argument = argument;
    }
}
