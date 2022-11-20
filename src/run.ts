import {Select} from "./models/select";
import {Namespace} from "./namespace";
import {Expression} from "./models/expression";
import {Variable} from "./models/variable";
import {Value} from "./models/value";
import {Operators} from "./constants/operators";
import {GeoQLFunction} from "./models/geoQLFunction";
import {FeatureCollection} from "./geo/featureCollection";
import {Feature} from "./geo/feature";

export function runStatement(select: Select): FeatureCollection {
    const namespace = Namespace.Instance

    const featureCollection = namespace.getFeatureCollection(select.from.table.value)

    const expression = getExpressionString(select.where)

    const features = filterFeatures(featureCollection, expression)

    const filteredFc = new FeatureCollection()
    filteredFc.id = "new"
    filteredFc.features = features
    return filteredFc
}

export function filterFeatures(fc: FeatureCollection, expression: string): Feature[] {
    // TODO filter features
}

export function getExpressionString(expression: Expression) {
    const expressionString = expressionToString(expression)
    if (expressionString.endsWith(" ")) {
        return expressionString.slice(0, -1)
    }
    return expressionString
}

export function expressionToString(expression: Expression) {
    let expressionString = ""
    expression.tokenValues.forEach(token => {
        if (token instanceof Variable) {
            console.log(token)
            expressionString += token.value
        } else if (token instanceof Value) {
            if (typeof token.x == "number") {
                expressionString += token.x
            } else {
                expressionString += '"' + token.x + '"'
            }
        } else if (Object.values(Operators).includes(token as Operators)) {
            let operator = (token as Operators).valueOf()
            operator = operator.replace("and", "&&")
            operator = operator.replace("or", "||")
            expressionString += operator
        } else if (token instanceof GeoQLFunction) {

            expressionString += token.name + "("

            if (token.argument instanceof Variable) {
                expressionString += token.argument.value
            } else if (typeof token.argument === "number") {
                expressionString += token.argument
            } else if (typeof token.argument === "string") {
                expressionString += '"' + token.argument + '"'
            }

            expressionString += ")"
        } else {
            expressionString += "("
            expressionString += expressionToString(token as Expression)
            expressionString += ")"
        }

        expressionString += " "
    })

    return expressionString
}
