import { literal } from "sequelize";
import { SortDirection } from "../../../shared/domain/repository/search-params";
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../domain/category.repository";
import { Category } from "../../domain/category.entity";
import { CategoryModel } from "./category.model";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "../../../shared/infra/db/in-memory/in-memory-repository";
import { Op } from "sequelize";
import { CategoryModelMapper } from "./category-model-mapper";


export class CategorySequelizeRepository
    extends InMemorySearchableRepository<Category, Uuid>
    implements ICategoryRepository {
    protected applyFilter(items: Category[], filter: string): Promise<Category[]> {
        throw new Error("Method not implemented.");
    }
    sortableFields: string[] = ['name', 'created_at'];
    orderBy = {
        mysql: {
            name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
        },
    };

    constructor(private categoryModel: typeof CategoryModel) {
        super();
    }

    async insert(entity: Category): Promise<void> {
        const model = CategoryModelMapper.toModel(entity);
        await this.categoryModel.create(model.toJSON());
    }

    async bulkInsert(entities: Category[]): Promise<void> {
        const models = entities.map((entity) => CategoryModelMapper.toModel(entity));
        await this.categoryModel.bulkCreate(models.map((model) => model.toJSON()));
    }

    async update(entity: Category): Promise<void> {
        const id = entity.category_id.id;
        const model = await this._get(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        }

        const modelToUpdate = CategoryModelMapper.toModel(entity);

        this.categoryModel.update(
            modelToUpdate.toJSON(),
            {
                where: { category_id: id },
            });
    }

    async delete(category_id: Uuid): Promise<void> {
        const id = category_id.id
        const model = await this._get(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        };

        this.categoryModel.destroy({
            where: { category_id: id },
        });
    }

    async findById(entity_id: Uuid): Promise<Category | null> {
        const model = await this._get(entity_id.id);

        return model ? new Category(CategoryModelMapper.toEntity(model)) : null;
    }

    private async _get(id: string) {
        return await this.categoryModel.findByPk(id);
    }

    async findAll(): Promise<Category[]> {
        const models = await this.categoryModel.findAll();
        return models.map((model) => {
            return CategoryModelMapper.toEntity(model);
        });
    }

    async search(props: CategorySearchParams): Promise<CategorySearchResult> {
        const offset = (props.page - 1) * props.per_page;
        const limit = props.per_page;

        const { rows: models, count } = await this.categoryModel.findAndCountAll({
            ...(props.filter && {
                where: {
                    name: {
                        [Op.like]: `%${props.filter}%`
                    },
                },
            }),
            ...(props.sort && this.sortableFields.includes(props.sort)
                ? { order: [[props.sort, props.sort_dir]] }
                : { order: [['created_at', 'desc']] }),
            offset,
            limit,
        });

        return new CategorySearchResult({
            items: models.map((model) => {
                return new Category({
                    category_id: new Uuid(model.category_id),
                    name: model.name,
                    description: model.description,
                    is_active: model.is_active,
                    created_at: model.created_at
                });
            }),
            current_page: props.page,
            per_page: props.per_page,
            total: count,
        })
    }

    getEntity(): new (...args: any[]) => Category {
        return Category;
    }
}