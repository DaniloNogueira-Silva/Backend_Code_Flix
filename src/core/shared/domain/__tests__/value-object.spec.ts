import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
    constructor(readonly value: string) {
        super();
    }
}

class ComplexValueObject extends ValueObject {
    constructor(readonly prop1: string, readonly prop2: number) {
        super();
    }
}

describe("Value Object Unit Tests", () => {

    test('should be equals', () => {

        const ValueObject1 = new StringValueObject('vo1');
        const ValueObject2 = new StringValueObject('vo1');
        expect(ValueObject1.equals(ValueObject2)).toBeTruthy();

        const ComplexValueObject1 = new ComplexValueObject('prop1', 1);
        const ComplexValueObject2 = new ComplexValueObject('prop1', 1);
        expect(ComplexValueObject1.equals(ComplexValueObject2)).toBeTruthy();

    });

    test('should not be equals', () => {
        const ValueObject1 = new StringValueObject('vo1');
        const ValueObject2 = new StringValueObject('vo2');
        expect(ValueObject1.equals(ValueObject2)).toBeFalsy();
        expect(ValueObject1.equals(null as any)).toBeFalsy();
        expect(ValueObject1.equals(undefined as any)).toBeFalsy();

        const ComplexValueObject1 = new ComplexValueObject('vo1', 1);
        const ComplexValueObject2 = new ComplexValueObject('vo1', 2);
        expect(ComplexValueObject1.equals(ComplexValueObject2)).toBeFalsy();
        expect(ComplexValueObject1.equals(null as any)).toBeFalsy();
        expect(ComplexValueObject1.equals(undefined as any)).toBeFalsy();
    })

})