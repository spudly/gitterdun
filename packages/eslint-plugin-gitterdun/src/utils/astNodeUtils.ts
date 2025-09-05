import type {
  ArrayExpression,
  ArrayPattern,
  Expression,
  ObjectExpression,
  ObjectPattern,
  Pattern,
} from 'estree';

// internal helper type; not exported to avoid knip unused exports
type IdentifierNode = {type: 'Identifier'; name: string};

type WithProperty = {property: unknown};
type WithObject = {object: unknown};
type WithCallee = {callee: unknown};

type MaybeComputed = {computed?: unknown};

type WithName = {name?: unknown};

const read = <T extends object, K extends keyof T>(obj: T, key: K): T[K] =>
  obj[key];

export const getType = (node: unknown): string | null => {
  if (typeof node !== 'object' || node === null) {
    return null;
  }
  const {type} = node as {type?: unknown};
  return typeof type === 'string' ? type : null;
};

export const isArrayPattern = (node: Pattern): node is ArrayPattern =>
  getType(node) === 'ArrayPattern';

export const isObjectPattern = (node: Pattern): node is ObjectPattern =>
  getType(node) === 'ObjectPattern';

export const isObjectExpression = (
  node: Expression,
): node is ObjectExpression => getType(node) === 'ObjectExpression';

export const isArrayExpression = (node: Expression): node is ArrayExpression =>
  getType(node) === 'ArrayExpression';

export const isIdentifier = (node: unknown): node is IdentifierNode => {
  return (
    getType(node) === 'Identifier'
    && typeof (node as WithName).name === 'string'
  );
};

export const isAwaitExpression = (node: unknown): boolean =>
  getType(node) === 'AwaitExpression';

const getMemberProperty = (member: unknown): unknown => {
  const prop = (member as WithProperty).property;
  return prop;
};

const getMemberObject = (member: unknown): unknown => {
  const obj = (member as WithObject).object;
  return obj;
};

const getCallCallee = (call: unknown): unknown => {
  const {callee} = call as WithCallee;
  return callee;
};

const isThenCatchFinallyCall = (expr: unknown): boolean => {
  if (getType(expr) !== 'CallExpression') {
    return false;
  }
  const callee = getCallCallee(expr);
  if (
    getType(callee) === 'MemberExpression'
    && (callee as MaybeComputed).computed === false
  ) {
    const property = getMemberProperty(callee);
    if (isIdentifier(property)) {
      return (
        property.name === 'then'
        || property.name === 'catch'
        || property.name === 'finally'
      );
    }
  }
  return false;
};

const isPromiseStaticCall = (expr: unknown): boolean => {
  if (getType(expr) !== 'CallExpression') {
    return false;
  }
  const callee = getCallCallee(expr);
  if (
    getType(callee) !== 'MemberExpression'
    || (callee as MaybeComputed).computed !== false
  ) {
    return false;
  }
  const object = getMemberObject(callee);
  const property = getMemberProperty(callee);
  if (
    !isIdentifier(object)
    || object.name !== 'Promise'
    || !isIdentifier(property)
  ) {
    return false;
  }
  const {name} = property;
  return (
    name === 'resolve'
    || name === 'reject'
    || name === 'all'
    || name === 'allSettled'
    || name === 'race'
    || name === 'any'
  );
};

const isNewPromise = (expr: unknown): boolean => {
  if (getType(expr) !== 'NewExpression') {
    return false;
  }
  const callee = read(expr as {callee: unknown}, 'callee');
  return isIdentifier(callee) && callee.name === 'Promise';
};

export const isPromiseLikeExpression = (expr: unknown): boolean => {
  const exprType = getType(expr);
  if (exprType === null) {
    return false;
  }
  if (exprType === 'AwaitExpression') {
    return false;
  }
  if (isThenCatchFinallyCall(expr)) {
    return true;
  }
  if (isPromiseStaticCall(expr)) {
    return true;
  }
  if (isNewPromise(expr)) {
    return true;
  }
  // Do not infer from callee names.
  return false;
};
