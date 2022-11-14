import {Namespace} from "./namespace";

export {tokenize} from './tokenize'
export {parse} from './parse'
export {Namespace} from './namespace'

const namespace = Namespace.Instance

// TODO parser and tokenizer needs to handle list of columns instead of only "*" -> columns zu eigenem tokentype machen (geometry dann vllt auch, damit man zwischen eigener geometry, eigenen feldern und feldern von anderen layern unterscheiden kann)
// TODO add Runner
// TODO make Layer an array like datastructur, so Runner can use .filter(expression) on it
// TODO make sure classes (former interfaces) are instantiated with new everywhere, also in the tests
