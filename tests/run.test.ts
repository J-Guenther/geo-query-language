import * as chai from 'chai';
import {runStatement} from "../src/run";
import {Select} from "../src/models/select";
import {Operators} from "../src/constants/operators";
import {Value} from "../src/models/value";
import {Variable} from "../src/models/variable";
import {GeoQLFunction} from "../src/models/geoQLFunction";

const expect = chai.expect;
describe('Runner', () => {

    it('should run statement with parenthesis', () => {

        const select: Select = {
            apply: null,
            columns: "*",
            from: {as: null, table: {value: "layer1"}},
            where: {
                tokenValues: [
                    new GeoQLFunction("Intersect", new Variable("layer2.geometry")),
                    Operators.AND,
                    {tokenValues: [new Variable("geometry.size"), Operators.LESS, new Value(100), Operators.OR, new Variable("geometry.size"), Operators.EQUAL, new Value(200)]}]
            }
        }

        expect(runStatement(select)).to.equal("Intersect(layer2.geometry) && (geometry.size < 100 || geometry.size == 200 )");
    });

    it('should run simple statement', () => {

        const select: Select = {
            apply: null,
            columns: ["name"],
            from: {as: null, table: {value: "layer1"}},
            where: {
                tokenValues: [new Variable("name"), Operators.EQUAL, new Value("Spandau")],
            }
        }

        expect(runStatement(select)).to.equal("name == \"Spandau\"");
    });



});
