import * as chai from 'chai';
import {parse} from "./parse";
import {Select} from "./models/select";

const expect = chai.expect;
describe('Parser', () => {

    it('should parse select1 statement', () => {

        const tokens = [
                { type: 'keyword', value: 'select' },
                { type: 'variable', value: '*' },
                { type: 'keyword', value: 'from' },
                { type: 'variable', value: 'layer1' },
                { type: 'keyword', value: 'where' },
                { type: 'variable', value: 'geometry.size' },
                { type: 'operator', value: '<' },
                { type: 'value', value: '100' }
            ]

        const expectedResult: Select = {
            apply: null, columns: "*", from: {as: null, table: "layer1"}, where: "geometry.size<100"

        }

        expect(parse(tokens)).to.deep.equal(expectedResult);
    });

});
