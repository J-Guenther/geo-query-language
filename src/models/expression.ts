import {Operators} from "../constants/operators";
import {Variable} from "./variable";
import {GeoQLFunction} from "./geoQLFunction";
import {Value} from "./value";

export class Expression {
    tokenValues: (Value | Variable | GeoQLFunction | Operators | Expression)[]

    constructor(tokenValues: (Value | Variable | GeoQLFunction | Operators | Expression)[]) {
        this.tokenValues = tokenValues;
    }
}
