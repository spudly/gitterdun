// internal helper type; not exported to avoid knip unused exports
type IdentifierNode = {type: 'Identifier'; name: string};

export const getType = (node: unknown): string | null => {
  if (typeof node !== 'object' || node === null) {
    return null;
  }
  const {type} = node as {type?: unknown};
  return typeof type === 'string' ? type : null;
};

export const isIdentifier = (node: unknown): node is IdentifierNode => {
  return (
    getType(node) === 'Identifier'
    && typeof (node as {name?: unknown}).name === 'string'
  );
};

export const isAwaitExpression = (node: unknown): boolean =>
  getType(node) === 'AwaitExpression';

const getMemberProperty = (member: unknown): unknown => {
  const {property} = member as {property: unknown};
  return property;
};

const getMemberObject = (member: unknown): unknown => {
  const {object} = member as {object: unknown};
  return object;
};

const getCallCallee = (call: unknown): unknown => {
  const {callee} = call as {callee: unknown};
  return callee;
};

const isThenCatchFinallyCall = (expr: unknown): boolean => {
  if (getType(expr) !== 'CallExpression') {
    return false;
  }
  const callee = getCallCallee(expr);
  if (
    getType(callee) === 'MemberExpression'
    && (callee as {computed?: unknown}).computed === false
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
    || (callee as {computed?: unknown}).computed !== false
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
  const {callee} = expr as {callee: unknown};
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
