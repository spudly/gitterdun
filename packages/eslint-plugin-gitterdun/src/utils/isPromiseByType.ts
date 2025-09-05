import type {Rule} from 'eslint';

type TypeCheckerLike = {
  getTypeAtLocation: (node: unknown) => unknown;
  getPromisedTypeOfPromise?: (type: unknown) => unknown;
};

type ProgramLike = {getTypeChecker: () => TypeCheckerLike};

type ParserServicesLike = {
  program?: ProgramLike;
  esTreeNodeToTSNodeMap?: {get: (node: unknown) => unknown};
};

const hasGetPromised = (checker: TypeCheckerLike): boolean =>
  typeof checker.getPromisedTypeOfPromise === 'function';

const promisedTypeExists = (
  checker: TypeCheckerLike,
  type: unknown,
): boolean => {
  if (!hasGetPromised(checker)) {
    return false;
  }
  try {
    const promised = checker.getPromisedTypeOfPromise?.(type);
    return promised !== null && promised !== undefined;
  } catch {
    return false;
  }
};

const isUnionType = (type: unknown): type is {types: Array<unknown>} => {
  const possible = type as {types?: Array<unknown>};
  return Array.isArray(possible.types);
};

export const isPromiseByType = (
  context: Rule.RuleContext,
  node: unknown,
): boolean => {
  const servicesRaw = context.sourceCode.parserServices;
  const services: ParserServicesLike = (servicesRaw
    ?? {}) as ParserServicesLike;
  const {program, esTreeNodeToTSNodeMap: map} = services;
  if (program === undefined || map === undefined) {
    return false;
  }

  const tsNode = map.get(node);
  if (tsNode === null || tsNode === undefined) {
    return false;
  }

  const checker = program.getTypeChecker();
  const type = checker.getTypeAtLocation(tsNode);

  const calls = (
    type as {getCallSignatures?: () => Array<unknown>}
  ).getCallSignatures?.();
  if (Array.isArray(calls) && calls.length > 0) {
    return false;
  }

  if (promisedTypeExists(checker, type)) {
    return true;
  }

  if (!isUnionType(type)) {
    return false;
  }
  return type.types.some(memberType => {
    const mt = memberType as {getCallSignatures?: () => Array<unknown>};
    const memberCalls = mt.getCallSignatures?.();
    if (Array.isArray(memberCalls) && memberCalls.length > 0) {
      return false;
    }
    return promisedTypeExists(checker, memberType);
  });
};
