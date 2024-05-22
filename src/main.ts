import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WrapperDataInterceptor } from './nest-modules/shared-module/interceptors/wrapper-data/wrapper-data.interceptor';
import { NotFoundErrorFilter } from './nest-modules/shared-module/filters/not-found-error.filter';
import { EntityValidationErrorFilter } from './nest-modules/shared-module/filters/entity-validation-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // vai aplicar todas as validações nos controllers
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );

  // vai aplicar o class-transfomer em tudo
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalInterceptors(new WrapperDataInterceptor());

  //tratamento de erro global notfound
  app.useGlobalFilters(new NotFoundErrorFilter(), new EntityValidationErrorFilter());
  await app.listen(3000);
}
bootstrap();
