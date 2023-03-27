import { ValueObject } from '../value-object';

class StubValueObject extends ValueObject {}

describe('[UNIT]: ValueObject', () => {
  it('should set value', () => {
    let valueObject = new StubValueObject('test');
    expect(valueObject.value).toBe('test');

    valueObject = new StubValueObject({ prop1: 'test' });
    expect(valueObject.value).toStrictEqual({ prop1: 'test' });
  });

  describe('convert to a string', () => {
    const date = new Date();
    let arrange = [
      { received: 'test', expected: 'test' },
      { received: date, expected: date.toString() },
      {
        received: { prop1: 'test' },
        expected: JSON.stringify({ prop1: 'test' }),
      },
      { received: [1, 2, 3], expected: '1,2,3' },
      { received: 10, expected: '10' },
      { received: true, expected: 'true' },
      { received: false, expected: 'false' },
      { received: '', expected: '' },
    ];

    test.each(arrange)(
      'from $received to $expected',
      ({ received, expected }) => {
        const valueObject = new StubValueObject(received);
        expect(valueObject.toString()).toBe(expected);
      },
    );
  });

  it('should be immutable', () => {
    const obj = {
      prop1: 'test',
      deep: { prop2: 'test2', prop3: new Date() },
    };

    const valueObject = new StubValueObject(obj);

    expect(() => {
      (valueObject as any).value.prop1 = 'test aaaa';
    }).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'",
    );

    expect(() => {
      (valueObject as any).value.deep.prop2 = 'test aaaa';
    }).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'",
    );

    expect(valueObject.value.deep.prop3).toBeInstanceOf(Date);
  });
});
