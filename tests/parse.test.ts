import * as chai from 'chai';
import {parse} from "../src";
import {Select} from "../src/models/select";
import {Operators} from "../src/constants/operators";
import {TokenTypes} from "../src/constants/tokenTypes";

const expect = chai.expect;
describe('Parser', () => {

    it('should parse select1 statement', () => {

        const tokens = [
                { type: TokenTypes.KEYWORD, value: 'select' },
                { type: TokenTypes.VARIABLE, value: '*' },
                { type: TokenTypes.KEYWORD, value: 'from' },
                { type: TokenTypes.VARIABLE, value: 'layer1' },
                { type: TokenTypes.KEYWORD, value: 'where' },
                { type: TokenTypes.VARIABLE, value: 'geometry.size' },
                { type: TokenTypes.OPERATOR, value: '<' },
                { type: TokenTypes.VALUE, value: '100' }
            ]

        const expectedResult: Select = {
            apply: null,
            columns: "*",
            from: {as: null, table: {value: "layer1"}},
            where: {
                expression: [{value: "geometry.size"}, Operators.LESS, {x: 100}],
                subgroupOperator: null,
                subgroup: null
            }

        }

        expect(parse(tokens)).to.deep.equal(expectedResult);
    });

});
