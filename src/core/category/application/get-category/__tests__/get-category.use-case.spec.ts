import { CategoryInMemoryRepository } from 'src/core/category/infra/db/in-memory/category-in-memory.repository';
import { GetCategoryUseCase } from '../get-category.use-case';
import { InvalidUuidError, Uuid } from 'src/core/shared/domain/value-objects/uuid.vo';
import { Category } from 'src/core/category/domain/category.entity';
import { NotFoundError } from 'src/core/shared/domain/errors/not-found.error';

describe('GetCategoryUseCase Unit Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
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

  it('should returns a category', async () => {
    const items = [Category.create({ name: 'Movie' })];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: items[0].category_id.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].category_id.id,
      name: 'Movie',
      description: null,
      is_active: true,
      created_at: items[0].created_at,
    });
  });
});
