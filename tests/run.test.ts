import * as chai from 'chai';
import {getExpressionString, runStatement} from "../src/run";
import {Select} from "../src/models/select";
import {Operators} from "../src/constants/operators";
import {Value} from "../src/models/value";
import {Variable} from "../src/models/variable";
import {GeoQLFunction} from "../src/models/geoQLFunction";
import {Feature} from "../src/geo/feature";
import {FeatureCollection} from "../src/geo/featureCollection";
import {Namespace} from "../src";

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

        expect(getExpressionString(select.where)).to.equal("Intersect(layer2.geometry) && (geometry.size < 100 || geometry.size == 200 )");
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

        expect(getExpressionString(select.where)).to.equal("name == \"Spandau\"");
    });

    it('should filter features', () => {
        const feature1 = new Feature()
        feature1.fields.set("name", "Spandau")

        const feature2 = new Feature()
        feature2.fields.set("name", "Berlin")

        const feature3 = new Feature()
        feature3.fields.set("name", "Spandau")

        const fc = new FeatureCollection()
        fc.id = "layer1"
        fc.features.push(feature1, feature2, feature3)

        const instance = Namespace.Instance
        instance.addFeatureCollection(fc.id, fc)

        const select: Select = {
            apply: null,
            columns: ["name"],
            from: {as: null, table: {value: "layer1"}},
            where: {
                tokenValues: [new Variable("name"), Operators.EQUAL, new Value("Spandau")],
            }
        }

        const filteredFeatures = runStatement(select)
        const expectedFc = new FeatureCollection()
        expectedFc.id = "new"
        expectedFc.features.push(feature1, feature3)

        expect(filteredFeatures).to.deep.equal(expectedFc)
    });


});
