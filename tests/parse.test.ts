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

    it('should throw an Error because the statement does not start with select', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'}
        ]

        const expectedResult = "Statement needs to start with select"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });

    it('should throw an Error because select appears twice', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'}
        ]

        const expectedResult = "Found unexpected use of select"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });

    it('should throw an Error because no columns where selected', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'}
        ]

        const expectedResult = "Unexpected token keyword, expected column name or *"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });

    it('should throw an Error because from is used twice', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
        ]

        const expectedResult = "Found unexpected use of from"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });

    it('should throw an Error because from is missing variable name', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'},
        ]

        const expectedResult = "Unexpected token keyword, expected field name"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });

    it('should throw an Error because where is used twice', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'},
            {type: TokenTypes.OPERATOR, value: 'and'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '=='},
            {type: TokenTypes.VALUE, value: '150'},
        ]

        const expectedResult = "Found unexpected use of where"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });

    it('should throw an Error because after where does not come a variable, value or function next', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.OPERATOR, value: 'and'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'}
        ]

        const expectedResult = "Unexpected token operator, expected field name, value or function"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });

    it('should throw an Error because of an unexpected token', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.GROUP_START, value: '('},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'}
        ]

        const expectedResult = "Unexpected token group_start"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });

    it('should parse simple token statement with string value', () => {

        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.VARIABLE, value: 'name'},
            {type: TokenTypes.OPERATOR, value: '=='},
            {type: TokenTypes.VALUE, value: 'Spandau'}
        ]

        const expectedResult: Select = {
            apply: null,
            columns: "*",
            from: {as: null, table: {value: "layer1"}},
            where: {
                tokenValues: [{value: "name"}, Operators.EQUAL, {x: "Spandau"}],
            }

        }

        expect(parse(tokens)).to.deep.equal(expectedResult);
    });

    it('should throw an Error because function has no arguments', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.FUNCTION, value: 'Intersect'},
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

        const expectedResult = "Function has no arguments"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });

    it('should throw an Error because there is no operator before an open parenthesis', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.FUNCTION, value: 'Intersect'},
            {type: TokenTypes.ARGUMENT, value: 'layer2'},
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

        const expectedResult = "There needs to be an operator before an opening parenthesis"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });
    it('should throw an Error because closing brackets are missing', function () {
        const tokens = [
            {type: TokenTypes.KEYWORD, value: 'select'},
            {type: TokenTypes.VARIABLE, value: '*'},
            {type: TokenTypes.KEYWORD, value: 'from'},
            {type: TokenTypes.VARIABLE, value: 'layer1'},
            {type: TokenTypes.KEYWORD, value: 'where'},
            {type: TokenTypes.FUNCTION, value: 'Intersect'},
            {type: TokenTypes.ARGUMENT, value: 'layer2'},
            {type: TokenTypes.OPERATOR, value: 'and'},
            {type: TokenTypes.GROUP_START, value: '('},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '<'},
            {type: TokenTypes.VALUE, value: '100'},
            {type: TokenTypes.OPERATOR, value: 'or'},
            {type: TokenTypes.VARIABLE, value: 'geometry.size'},
            {type: TokenTypes.OPERATOR, value: '=='},
            {type: TokenTypes.VALUE, value: '200'},
        ]

        const expectedResult = "Missing closing parenthesis"

        expect(() => parse(tokens)).to.throw(expectedResult)
    });


});
