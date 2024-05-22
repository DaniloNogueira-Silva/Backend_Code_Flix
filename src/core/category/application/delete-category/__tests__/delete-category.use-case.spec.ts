import { CategoryInMemoryRepository } from 'src/core/category/infra/db/in-memory/category-in-memory.repository';
import {
  InvalidUuidError,
  Uuid,
} from 'src/core/shared/domain/value-objects/uuid.vo';
import { Category } from 'src/core/category/domain/category.entity';
import { NotFoundError } from 'src/core/shared/domain/errors/not-found.error';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('DeleteCategoryUseCase Unit Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const id = new Uuid();

    await expect(() => useCase.execute({ id: id.id })).rejects.toThrow(
      new NotFoundError(id.id, Category),
    );
  });

  it('should delete a category', async () => {
    const items = [new Category({ name: 'test 1' })];
    repository.items = items;
    await useCase.execute({
      id: items[0].category_id.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
