import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { CategorySequelizeRepository } from "src/core/category/infra/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/sequelize/category.model";
import { CreateCategoryUseCase } from "../create-category.use-case";


describe("CreateCategoryUseCase Integration Tests", () => {
    
    let useCase: CreateCategoryUseCase;
    //usar o repositório sequelize para testes de integração
    let repository: CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(async () => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new CreateCategoryUseCase(repository);
    });

    it("should create a category", async () => {
        let output = await useCase.execute({ name: "Movie" });
        let entity = await repository.findById(new Uuid(output.id));
        expect(output).toStrictEqual({
            id: entity.category_id.id,
            name: "Movie",
            description: null,
            is_active: true,
            created_at: entity.created_at
        });

        output = await useCase.execute({
            name: "Movie2",
            description: "some description",
            is_active: false
        });
        entity = await repository.findById(new Uuid(output.id));
        expect(output).toStrictEqual({
            id: entity.category_id.id,
            name: "Movie2",
            description: "some description",
            is_active: false,
            created_at: entity.created_at
        });

    })
})