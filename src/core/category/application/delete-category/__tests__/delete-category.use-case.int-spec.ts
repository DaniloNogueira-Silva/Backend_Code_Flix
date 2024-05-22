import { Category } from 'src/core/category/domain/category.entity';
import { NotFoundError } from 'src/core/shared/domain/errors/not-found.error';
import { CategoryModel } from 'src/core/category/infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from 'src/core/category/infra/db/sequelize/category-sequelize.repository';
import { setupSequelize } from 'src/core/shared/infra/testing/helpers';

import { DeleteCategoryUseCase } from '../delete-category.use-case';
import { Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const id = new Uuid();
    await expect(() => useCase.execute({ id: id.id })).rejects.toThrow(
      new NotFoundError(id.id, Category),
    );
  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await useCase.execute({
      id: category.category_id.id,
    });
    await expect(repository.findById(category.category_id)).resolves.toBeNull();
  });
});
