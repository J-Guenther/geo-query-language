import * as chai from 'chai';
import {runStatement} from "../src/run";
import {Select} from "../src/models/select";
import {Operators} from "../src/constants/operators";
import {Value} from "../src/models/value";
import {Variable} from "../src/models/variable";

const expect = chai.expect;
describe('Runner', () => {

    it('should run ', () => {

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
