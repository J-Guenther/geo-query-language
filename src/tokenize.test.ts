import * as chai from 'chai';
import {tokenize} from "./tokenize";

const expect = chai.expect;
describe('Tokenizer', () => {

    const select1 = "select * from layer1 where geometry.size < 100"
    const select2 = 'select * from layer1 where layer2.name == "Spandau"'
    const select3 = 'select * from layer-1 where layer2.name == "Spandau"'

    it('should tokenize select1 statement', () => {

        const expectedResult = {
            error: false,
            tokens: [
                { type: 'keyword', value: 'select' },
                { type: 'variable', value: '*' },
                { type: 'keyword', value: 'from' },
                { type: 'variable', value: 'layer1' },
                { type: 'keyword', value: 'where' },
                { type: 'variable', value: 'geometry.size' },
                { type: 'operator', value: '<' },
                { type: 'value', value: '100' }
            ]
        }

        expect(tokenize(select1)).to.deep.equal(expectedResult);
    });

    it('should tokenize statement with quotes', () => {

        const expectedResult = {
            error: false,
            tokens: [
                { type: 'keyword', value: 'select' },
                { type: 'variable', value: '*' },
                { type: 'keyword', value: 'from' },
                { type: 'variable', value: 'layer1' },
                { type: 'keyword', value: 'where' },
                { type: 'variable', value: 'layer2.name' },
                { type: 'operator', value: '==' },
                { type: 'value', value: 'Spandau' }
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

});
