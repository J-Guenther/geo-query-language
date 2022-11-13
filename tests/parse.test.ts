import * as chai from 'chai';
import {parse} from "../src";
import {Select} from "../src/models/select";
import {Operators} from "../src/constants/operators";
import {TokenTypes} from "../src/constants/tokenTypes";

const expect = chai.expect;
describe('Parser', () => {

    it('should parse simple token statement', () => {

        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'}
        ]

        const expectedResult: Select = {
            apply: null,
            columns: "*",
            from: {as: null, table: {value: "layer1"}},
            where: {
                tokenValues: [{value: "geometry.size"}, Operators.LESS, {x: 100}],
            }

        }

        expect(parse(tokens)).to.deep.equal(expectedResult);
    });

    it('should parse token statement with function', () => {

        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.FUNCTION, value: 'Intersect'},
            {type: TokenTypes.ARGUMENT, value: 'layer2.geometry'},
            {type: TokenTypes.OPERATOR, value: 'and'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'}
        ]

        const expectedResult: Select = {
            apply: null,
            columns: "*",
            from: {as: null, table: {value: "layer1"}},
            where: {
                tokenValues: [{
                    name: "Intersect",
                    argument: "layer2.geometry"
                }, Operators.AND, {value: "geometry.size"}, Operators.LESS, {x: 100}],
            }

        }

        expect(parse(tokens)).to.deep.equal(expectedResult);
    });

    it('should parse token statement with parenthesis', () => {

        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.FUNCTION, value: 'Intersect'},
            {type: TokenTypes.ARGUMENT, value: 'layer2.geometry'},
            {type: TokenTypes.OPERATOR, value: 'and'},
            {type: TokenTypes.GROUP_START, value: '('},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'},
            {type: TokenTypes.OPERATOR, value: 'or'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '=='},
            {type: TokenTypes.VALUE, value: '200'},
            {type: TokenTypes.GROUP_END, value: ')'},
        ]

        const expectedResult: Select = {
            apply: null,
            columns: "*",
            from: {as: null, table: {value: "layer1"}},
            where: {
                tokenValues: [
                    {
                        name: "Intersect",
                        argument: "layer2.geometry"
                    },
                    Operators.AND,
                    {tokenValues: [{value: "geometry.size"}, Operators.LESS, {x: 100}, Operators.OR, {value: "geometry.size"}, Operators.EQUAL, {x: 200}]}]
            }
        }

        expect(parse(tokens)).to.deep.equal(expectedResult);
    });

});
