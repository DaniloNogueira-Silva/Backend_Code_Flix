import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity"

describe('Category Unit Tests', () => {

    describe('Create command', () => {

        test('should create a category with default values', () => {
            const category = new Category({
                name: 'Movie'
            });

            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe('Movie');
            expect(category.description).toBeNull();
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);

        });

        test('should create a category with all values', () => {
            const created_at = new Date();
            const category = new Category({
                name: 'Movie',
                description: 'some description',
                is_active: false,
                created_at: created_at
            });

            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe('Movie');
            expect(category.description).toBe('some description');
            expect(category.is_active).toBeFalsy();
            expect(category.created_at).toBe(created_at);
        });

        test('should create a category with name and description', () => {

            const category = new Category({
                name: 'Movie',
                description: 'some description',
            })

            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe('Movie');
            expect(category.description).toBe('some description');
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
        });
    })

    describe('Category methods', () => {

        test('should change name', () => {

            const category = new Category({
                name: 'Movie',
            })

            category.changeName('Movie 2');
            expect(category.name).toBe('Movie 2');
        });

        test('should change description', () => {

            const category = new Category({
                name: 'Movie',
                description: 'some Movie',
            })

            category.changeDescription('some Movie 2');
            expect(category.description).toBe('some Movie 2');
        });

        test('should deactivate category', () => {

            const category = new Category({
                name: 'Movie',
                description: 'some Movie',
                is_active: true
            })

            category.deactivate();
            expect(category.is_active).toBeFalsy();
        });

        test('should activate category', () => {

            const category = new Category({
                name: 'Movie',
                description: 'some Movie',
                is_active: false
            })

            category.activate();
            expect(category.is_active).toBeTruthy();
        });
    })

    describe('category_id filed', () => {

        const arrange = [{ category_id: null }, { category_id: undefined }, { category_id: new Uuid }];
        test.each(arrange)('id = %j', ({ category_id }) => {
            const category = new Category({ 
                name: 'Movie', 
                category_id: category_id as any 
            });
            expect(category.category_id).toBeInstanceOf(Uuid);
            if(category_id instanceof Uuid) {
                expect(category.category_id).toBe(category_id);
            }
        })
    })
})