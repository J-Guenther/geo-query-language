import {Geometry} from "./geometry";

export class Feature {
    geometry: Geometry
    fields: Map<string, string | number>
}
