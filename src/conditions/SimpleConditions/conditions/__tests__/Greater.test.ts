import { Greater, gt } from 'conditions';
import { TypeError } from 'conditions/errors';

describe('Greater tests', () => {
  const limit = 1000;
  let testInstance: Greater;

  beforeEach(() => {
    testInstance = gt(limit);
  });

  it('should return true when a passed value is greater than a limit', () => {
    expect(testInstance.check(1001)).toBeTruthy();
  });

  it('should return false when a passed value is less than a limit', () => {
    expect(testInstance.check(999)).toBeFalsy();
  });

  it('should return false when a passed value is equal to a limit', () => {
    expect(testInstance.check(limit)).toBeFalsy();
  });

  it('should throw TypeError when expected a SimpleValue but null is passed', () => {
    expect(() => testInstance.check(null)).toThrow(TypeError);
  });

  it('should throw TypeError when null is passed as a limit', () => {
    const someValue = 'some string';
    testInstance = gt(null);

    expect(() => testInstance.check(someValue)).toThrow(TypeError);
  });
});