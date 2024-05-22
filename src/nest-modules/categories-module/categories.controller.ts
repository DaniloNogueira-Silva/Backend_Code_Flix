import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from 'src/core/category/application/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from 'src/core/category/application/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from 'src/core/category/application/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from 'src/core/category/application/get-category/get-category.use-case';
import { ListCategoriesUseCase } from 'src/core/category/application/list-category/list-categories.use-case';
import { CategoryPresenter } from './categories.presenter';
import { CategoryOutput } from 'src/core/category/application/common/category-output';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private listUseCase: ListCategoriesUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);
    return CategoriesController.serialize(output);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
