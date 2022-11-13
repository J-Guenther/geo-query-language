import * as chai from 'chai';
import {tokenize} from "../src";
import {TokenTypes} from "../src/constants/tokenTypes";

const expect = chai.expect;
describe('Tokenizer', () => {

    const select1 = "select * from layer1 where geometry.size < 100"
    const select2 = 'select * from layer1 where layer1.name == "Spandau"'
    const select3 = 'select * from layer-1 where layer1.name == "Spandau"'
    const select4 = 'select * from layer1 where layer1.name == "Spandau" and Intersect(layer2)'
    const select5 = 'select * from layer1 where layer1.name == "Spandau" or (Intersect(layer2) and layer1.type == "Forest")'
    const select6 = 'select * from layer1 where layer1.name == "Spandau" or (Intersect(layer2) and layer1.type == "Forest"'
    const select7 = 'select * from layer1 where layer1.name == "Spandau" and Intersectlayer2)'
    const select8 = 'select * from layer1 where layer1.name == "Spandau" and Intersect(layer2'

    it('should tokenize select1 statement', () => {

        const expectedResult = {
            error: false,
            tokens: [
                { type: TokenTypes.KEYWORD, value: 'select' },
                { type: TokenTypes.VARIABLE, value: '*' },
                { type: TokenTypes.KEYWORD, value: 'from' },
                { type: TokenTypes.VARIABLE, value: 'layer1' },
                { type: TokenTypes.KEYWORD, value: 'where' },
                { type: TokenTypes.VARIABLE, value: 'geometry.size' },
                { type: TokenTypes.OPERATOR, value: '<' },
                { type: TokenTypes.VALUE, value: '100' }
            ]
        }

        expect(tokenize(select1)).to.deep.equal(expectedResult);
    });

    it('should tokenize statement with quotes', () => {

        const expectedResult = {
            error: false,
            tokens: [
                { type: TokenTypes.KEYWORD, value: 'select' },
                { type: TokenTypes.VARIABLE, value: '*' },
                { type: TokenTypes.KEYWORD, value: 'from' },
                { type: TokenTypes.VARIABLE, value: 'layer1' },
                { type: TokenTypes.KEYWORD, value: 'where' },
                { type: TokenTypes.VARIABLE, value: 'layer1.name' },
                { type: TokenTypes.OPERATOR, value: '==' },
                { type: TokenTypes.VALUE, value: 'Spandau' }
            ]
        }

        expect(tokenize(select2)).to.deep.equal(expectedResult);
    });

    it('should throw error when tokenize select3 statement', () => {

        const expectedResult = {
            error: "Unexpected character -",
        }

        expect(tokenize(select3)).to.deep.equal(expectedResult);
    });

    it('should tokenize select4 statement with function', () => {
        const expectedResult = {
            error: false,
            tokens: [
                { type: TokenTypes.KEYWORD, value: 'select' },
                { type: TokenTypes.VARIABLE, value: '*' },
                { type: TokenTypes.KEYWORD, value: 'from' },
                { type: TokenTypes.VARIABLE, value: 'layer1' },
                { type: TokenTypes.KEYWORD, value: 'where' },
                { type: TokenTypes.VARIABLE, value: 'layer1.name' },
                { type: TokenTypes.OPERATOR, value: '==' },
                { type: TokenTypes.VALUE, value: 'Spandau' },
                { type: TokenTypes.OPERATOR, value: 'and' },
                { type: TokenTypes.FUNCTION, value: 'Intersect' },
                { type: TokenTypes.ARGUMENT, value: 'layer2' },
            ]
        }

        expect(tokenize(select4)).to.deep.equal(expectedResult);
    })

    it('should tokenize select5 statement with parenthesis', () => {
        const expectedResult = {
            error: false,
            tokens: [
                { type: TokenTypes.KEYWORD, value: 'select' },
                { type: TokenTypes.VARIABLE, value: '*' },
                { type: TokenTypes.KEYWORD, value: 'from' },
                { type: TokenTypes.VARIABLE, value: 'layer1' },
                { type: TokenTypes.KEYWORD, value: 'where' },
                { type: TokenTypes.VARIABLE, value: 'layer1.name' },
                { type: TokenTypes.OPERATOR, value: '==' },
                { type: TokenTypes.VALUE, value: 'Spandau' },
                { type: TokenTypes.OPERATOR, value: 'or' },
                { type: TokenTypes.GROUP_START, value: '(' },
                { type: TokenTypes.FUNCTION, value: 'Intersect' },
                { type: TokenTypes.ARGUMENT, value: 'layer2' },
                { type: TokenTypes.OPERATOR, value: 'and' },
                { type: TokenTypes.VARIABLE, value: 'layer1.type' },
                { type: TokenTypes.OPERATOR, value: '==' },
                { type: TokenTypes.VALUE, value: 'Forest' },
                { type: TokenTypes.GROUP_END, value: ')' }
            ]
        }

        expect(tokenize(select5)).to.deep.equal(expectedResult);
    })

    it('should throw error because of missing closing brackets', () => {
        const expectedResult = {
            error: "Unterminated parenthesis",
        }

        expect(tokenize(select6)).to.deep.equal(expectedResult);
    })

    it('should throw error because no opening brackets after function name', () => {
        const expectedResult = {
            error: "Expect function arguments for: Intersectlayer2",
        }

        expect(tokenize(select7)).to.deep.equal(expectedResult);
    })

    it('should throw error because no closing brackets after function arguments', () => {
        const expectedResult = {
            error: "Unterminated parenthesis",
        }

        expect(tokenize(select8)).to.deep.equal(expectedResult);
    })

});
