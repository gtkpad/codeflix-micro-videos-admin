import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@codeflix/micro-videos/category/application';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryPresenter } from './presenter/category.presenter';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase.UseCase)
  private readonly createUseCase: CreateCategoryUseCase.UseCase;

  @Inject(UpdateCategoryUseCase.UseCase)
  private readonly updateUseCase: UpdateCategoryUseCase.UseCase;

  @Inject(ListCategoriesUseCase.UseCase)
  private readonly listUseCase: ListCategoriesUseCase.UseCase;

  @Inject(GetCategoryUseCase.UseCase)
  private readonly getUseCase: GetCategoryUseCase.UseCase;

  @Inject(DeleteCategoryUseCase.UseCase)
  private readonly deleteUseCase: DeleteCategoryUseCase.UseCase;

  @Post()
  public async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);
    return new CategoryPresenter(output);
  }

  @Get()
  public async search(@Query() searchParams: SearchCategoryDto) {
    return this.listUseCase.execute(searchParams);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const output = await this.getUseCase.execute({
      id,
    });

    return new CategoryPresenter(output);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateCategoryDto,
    });

    return new CategoryPresenter(output);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.deleteUseCase.execute({ id });
  }
}
