import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model-mapper";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe( 'CategoryModelMapper Integration Test', () =>
{

    setupSequelize({models: [CategoryModel]});

    test( 'should throws error when category is invalid', () =>
    {
        const model = CategoryModel.build( {
            category_id: '9655c6f0-3a3a-4b3a-8b3a-8b3a8b3a8b3a',
        } )

        try
        {
            CategoryModelMapper.toEntity( model );
            fail( 'The category is valid, but it needs throws a entity validation error' );
        } catch ( e )
        {
            expect( e ).toBeInstanceOf( EntityValidationError );
            expect( ( e as EntityValidationError ).error ).toMatchObject(
                {
                    name: [
                        "name should not be empty",
                        "name must be a string",
                        "name must be shorter than or equal to 255 characters"
                    ],
                }
            )
        }
    } );
} )