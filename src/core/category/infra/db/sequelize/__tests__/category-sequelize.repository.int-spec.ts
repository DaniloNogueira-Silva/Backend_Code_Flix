import { CategoryModel } from "../category.model";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe('CategorySequelizeRepository Integration Test', () => {
    let repository: CategorySequelizeRepository;

    setupSequelize({models: [CategoryModel]});

    beforeAll(async () => {
        repository = new CategorySequelizeRepository(CategoryModel);
    });

    test('should insert a new category', async () => {
        let category = Category.create({
            name: 'Movie',
        });
        await repository.insert(category);
        let entity = await repository.findById(category.category_id);

        category = Category.create({
            name: 'Movie',
            description: 'some description',
            is_active: false,
        });
        await repository.insert(category);
        entity = await repository.findById(category.category_id);
        expect(entity.toJSON()).toStrictEqual(category.toJSON());
    });

    test('should finds a entity by id', async () => {
        const entity = Category.fake().aCategory().build();
        await repository.insert(entity);
        let entityFound = await repository.findById(entity.category_id);
        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    });

    test('should return all categories', async () => {
        const entity = Category.fake().aCategory().build();
        await repository.insert(entity);

        const entities = await repository.findAll();
        expect(entities).toHaveLength(1);
        expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    });

    test('should throw error on update when a entity not found', async () => {
        const entity = Category.fake().aCategory().build();
        await expect(repository.update(entity)).rejects.toThrow(
            new NotFoundError(entity.category_id.id, Category)
        )
    });

    test('should update a entity', async () => {
        const entity = Category.fake().aCategory().build();
        await repository.insert(entity);

        entity.changeName('movie updated');
        await repository.update(entity);

        const entityFound = await repository.findById(entity.category_id);
        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    });

    test('should throw error on delete when a entity not found', async () => {
        const categoryId = new Uuid();
        await expect(repository.delete(categoryId)).rejects.toThrow(
            new NotFoundError(categoryId.id, Category)
        )
    });

    test('should delete a entity', async () => {
        const entity = Category.fake().aCategory().build();
        await repository.insert(entity);

        await repository.delete(entity.category_id);

        await expect(repository.findById(entity.category_id)).resolves.toBeNull();
    });
});
