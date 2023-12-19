import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CreateProductInput } from './dto/create-product-input';
import { UpdateProductInput } from './dto/update-product-input';
import { ImageEntity } from 'src/images/image.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    try {
      const products = await this.productRepository.find({
        relations: ['images'],
      });

      //for loop iterates over each product
      for (const product of products) {
        //query imageRepository to retrieve image for each product
        const images = await this.imageRepository.find({
          where: { product: { _id: product._id } },
        });

        //retireved images for every product are transformed by mapping
        product.images = images.map((image) => ({
          ...image, //creates new obj with img properties
          id: image._id.toHexString(), //converts id to a string
        }));
      }

      //mapping over each product
      const transformedProducts = products.map((product) => ({
        ...product, //create product obj with all product properties
        id: product._id.toHexString(),
        images: product.images, //sending the transformered images
      }));

      return transformedProducts;
    } catch (error) {
      throw new NotFoundException(
        `Failed to find all products: ${error.message}`,
      );
    }
  }

  async findOneById(id: string): Promise<ProductEntity> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new NotFoundException(`Product with ID "${id}" is invalid`);
      }

      const objectId = new ObjectId(id);

      //query in db to find product that matches the id
      const product = await this.productRepository.findOne({
        where: { _id: objectId },
        relations: ['images'],
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      //if the product is found and it has images, each image is transformed
      const transformedImages = product.images?.map((image) => ({
        ...image,
        id: image._id.toHexString(),
      }));

      const result = {
        ...product,
        id: product._id.toHexString(),
        images: transformedImages,
      };

      return result;
    } catch (error) {
      throw new Error(`Failed to find the product: ${error.message}`);
    }
  }

  async create(createProductDto: CreateProductInput): Promise<ProductEntity> {
    try {
      const imageEntities = createProductDto.images.map(
        (imageData) => this.imageRepository.create(imageData), //for every image data it creates an image entity
      );
      await this.imageRepository.save(imageEntities);

      //create new product entity with data taken from createProductDto and previously created and saved images are assigned
      const newProduct = this.productRepository.create({
        ...createProductDto,
        images: imageEntities,
      });
      await this.productRepository.save(newProduct);

      const result = {
        ...newProduct,
        id: newProduct._id.toHexString(),
        images: newProduct.images?.map((image) => ({
          ...image,
          id: image._id.toHexString(),
        })),
      };
      return result;
    } catch (error) {
      throw new Error(`Failed to create the product: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductInput,
  ): Promise<ProductEntity> {
    const objectId = new ObjectId(id);

    //decosntruct properties
    const { images, ...updateFields } = updateProductDto;

    await this.productRepository.update({ _id: objectId }, updateFields);

    const updatedProduct = await this.productRepository.findOne({
      where: { _id: objectId },
      relations: ['images'],
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    //if product is null it gives []
    updatedProduct.images = updatedProduct.images ?? [];

    //if image array is bigger than 0 it enters the block
    if (images && images.length > 0) {
      updatedProduct.images = [];

      //this function iterates over each image in the images array
      for (const imageInput of images) {
        let imageEntity: ImageEntity;
        const existingImage = await this.imageRepository.findOne({
          where: {
            url: imageInput.url,
            product: { _id: objectId },
          },
        });

        //checks if existing img matches the previous criteria
        if (existingImage) {
          imageEntity = this.imageRepository.merge(existingImage, imageInput);
        } else {
          //if existingImage data is not found, it creates new img
          imageEntity = this.imageRepository.create(imageInput);
          imageEntity.product = updatedProduct;
        }

        const savedImage = await this.imageRepository.save(imageEntity);
        updatedProduct.images.push(savedImage);
      }
    }

    //saving the new updatedProduct to the db
    const result = await this.productRepository.save(updatedProduct);

    const solve = {
      ...result,
      id: result._id.toHexString(),
      images: result.images.map((image) => ({
        ...image,
        id: image._id.toHexString(),
      })),
    };

    return solve;
  }

  async delete(id: string): Promise<ProductEntity> {
    try {
      const objectId = new ObjectId(id);
      const product = await this.productRepository.findOneBy({ _id: objectId });
      if (!product) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }

      const deleteResult = await this.productRepository.delete({
        _id: objectId,
      });
      if (!deleteResult.affected) {
        throw new NotFoundException(`Failed to delete product with ID "${id}"`);
      }

      const result = {
        ...product,
        id: product._id.toHexString(),
      };

      return result;
    } catch (error) {
      throw new Error(`Failed to delete the product: ${error.message}`);
    }
  }
}
