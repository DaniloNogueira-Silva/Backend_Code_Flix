import { OmitType } from '@nestjs/mapped-types';
import { UpdateCategoryInput } from 'src/core/category/application/update-category/update-category.input';

export class UpdatedCategoryInputWithoutId extends OmitType(
  UpdateCategoryInput,
  ['id'] as const,
) {}

export class UpdateCategoryDto extends UpdatedCategoryInputWithoutId {}
