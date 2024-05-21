import { InvalidUuidError, Uuid } from "../uuid.vo";
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';


describe('Uuid Unit Tests', () => {

    const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

    test('should thow error when uuid is invalid', () => {
        expect(() => {
            new Uuid("invalid-uuid");
        }).toThrow(new InvalidUuidError());
        expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should create a valid uuid', () => {
        const uuid = new Uuid();
        expect(uuid.id).toBeDefined();
        expect(uuidValidate(uuid.id)).toBeTruthy();
        expect(validateSpy).toHaveBeenCalledTimes(1);
    })

    test('should accept a valid uuid', () => {
        const uuid = new Uuid('cc0f6b9e-6e0e-4f6b-8b9e-6e0ecc0f6b9e');
        expect(uuid.id).toBe("cc0f6b9e-6e0e-4f6b-8b9e-6e0ecc0f6b9e");
        expect(validateSpy).toHaveBeenCalledTimes(1);
    })
})