import { IUseCase } from "../../../../core/shared/application/use-case.interface";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { ICategoryRepository } from "../../domain/category.repository";


export class DeleteCategoryUseCase
    implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
    constructor(private categoryRepo: ICategoryRepository) {}

    async execute(Input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
        const uuid = new Uuid(Input.id);
        await this.categoryRepo.delete(uuid);
    }
}

export type DeleteCategoryInput = {
    id: string;
};

type DeleteCategoryOutput = void;