import { GetCategoryUseCase } from '../get-category.use-case';
import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { Category } from 'src/core/category/domain/category.entity';
import { NotFoundError } from 'src/core/shared/domain/errors/not-found.error';
import { CategoryModel } from 'src/core/category/infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from 'src/core/category/infra/db/sequelize/category-sequelize.repository';
import { setupSequelize } from 'src/core/shared/infra/testing/helpers';

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const id = new Uuid();
    await expect(() => useCase.execute({ id: id.id })).rejects.toThrow(
      new NotFoundError(id.id, Category),
    );
  });

  it('should returns a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const output = await useCase.execute({ id: category.category_id.id });
    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
