import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductType } from './product.type';
import { CreateProductInput } from './dto/create-product-input';
import { UpdateProductInput } from './dto/update-product-input';
import { ProductEntity } from './product.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

//resolvers are functions that connect GraphQL query and mutations with the actual data

@Resolver(ProductType)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [ProductType])
  async products(): Promise<ProductEntity[]> {
    try {
      return await this.productService.findAll();
    } catch (error) {
      throw new Error(`Failed to resolve products: ${error.message}`);
    }
  }

  @Query(() => ProductType, { nullable: true })
  async getProduct(@Args('id') id: string): Promise<ProductEntity> {
    try {
      const product = await this.productService.findOneById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => ProductType)
  async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<ProductEntity> {
    try {
      const product = await this.productService.create(input);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Mutation(() => ProductType)
  async updateProduct(
    @Args('id') id: string,
    @Args('input') updateProductInput: UpdateProductInput,
  ): Promise<ProductEntity> {
    try {
      const updatedProduct = await this.productService.update(
        id,
        updateProductInput,
      );

      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Mutation(() => ProductType)
  async deleteProduct(@Args('id') _id: string): Promise<ProductEntity> {
    try {
      const product = await this.productService.delete(_id);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
