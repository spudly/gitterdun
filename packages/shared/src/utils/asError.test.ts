import {describe, expect, test} from '@jest/globals';
import {asError} from './asError.js';

describe('asError', () => {
  describe('when value is already an Error', () => {
    test('should return the Error unchanged', () => {
      const originalError = new Error('Original error message');
      const result = asError(originalError);

      expect(result).toBe(originalError);
      expect(result.message).toBe('Original error message');
    });

    test('should preserve Error subclasses', () => {
      const typeError = new TypeError('Type error message');
      const result = asError(typeError);

      expect(result).toBe(typeError);
      expect(result).toBeInstanceOf(TypeError);
      expect(result.message).toBe('Type error message');
    });

    test('should preserve custom properties', () => {
      const errorWithProps = new Error('Error with props');
      const extendedError = Object.assign(errorWithProps, {
        customProp: 'custom value',
        status: 404,
      });

      const result = asError(errorWithProps);

      expect(result).toBe(errorWithProps);
      expect(extendedError.customProp).toBe('custom value');
      expect(extendedError.status).toBe(404);
    });
  });

  describe('when value is not an Error', () => {
    describe('primitive values', () => {
      test('should create Error with descriptive message for string', () => {
        const result = asError('test string');

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBe('test string');
      });

      test('should create Error with descriptive message for number', () => {
        const result = asError(42);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBe(42);
      });

      test('should create Error with descriptive message for boolean true', () => {
        const result = asError(true);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBe(true);
      });

      test('should create Error with descriptive message for boolean false', () => {
        const result = asError(false);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBe(false);
      });
    });

    describe('null and undefined', () => {
      test('should create Error with descriptive message for null', () => {
        const result = asError(null);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBeNull();
      });

      test('should create Error with descriptive message for undefined', () => {
        const result = asError(undefined);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBeUndefined();
      });
    });

    describe('complex values', () => {
      test('should create Error with descriptive message for object', () => {
        const testObject = {foo: 'bar', num: 123};
        const result = asError(testObject);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBe(testObject);
      });

      test('should create Error with descriptive message for array', () => {
        const testArray = [1, 2, 3];
        const result = asError(testArray);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBe(testArray);
      });
    });

    describe('special types', () => {
      test('should create Error with descriptive message for Symbol', () => {
        const testSymbol = Symbol('test');
        const result = asError(testSymbol);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBe(testSymbol);
      });

      test('should create Error with descriptive message for BigInt', () => {
        const testBigInt = BigInt(123);
        const result = asError(testBigInt);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBe(testBigInt);
      });

      test('should create Error with descriptive message for function', () => {
        const testFunction = () => 'test';
        const result = asError(testFunction);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Non-Error value thrown!');
        expect(result.value).toBe(testFunction);
      });
    });
  });

  describe('return type properties', () => {
    test('should return an object that can have type property', () => {
      const result = asError('test');
      result.type = 'custom-error';

      expect(result.type).toBe('custom-error');
    });

    test('should return an object that can have status property', () => {
      const result = asError('test');
      result.status = 500;

      expect(result.status).toBe(500);
    });

    test('should return an object that can have value property', () => {
      const result = asError('test');

      expect(result.value).toBe('test');
    });
  });
});
