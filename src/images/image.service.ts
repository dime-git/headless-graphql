import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ImageEntity } from './image.entity';
import { CreateImageInput } from './dto/create-image-input';
import { UpdateImageInput } from './dto/update-image-input';

//services are classes that encapsulate the business logic of the application

@Injectable() //decorator for service class
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
  ) {}

  async findAll(): Promise<ImageEntity[]> {
    const images = await this.imageRepository.find();
    return images.map((image) => ({
      ...image, //new obj with all the image properties
      id: image._id.toHexString(), //converting the id
    }));
  }

  async findOneById(id: string): Promise<ImageEntity> {
    //checks if id is valid in db
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException(`Image with ID "${id}" is invalid`);
    }

    //create instance of ObjectId
    const objectId = new ObjectId(id);

    //fetching image with id in the db
    const image = await this.imageRepository.findOneBy({ _id: objectId });

    if (!image) {
      throw new NotFoundException(`Image with ID "${id}" not found`);
    }

    const transformedImage = {
      ...image, //create obj with image properties
      id: objectId.toHexString(), //converts id to a string
    };

    return transformedImage;
  }

  async create(createImageDto: CreateImageInput): Promise<ImageEntity> {
    try {
      //creates new img entity using createImageDto data
      const newImage = this.imageRepository.create(createImageDto);

      //saves the new image
      const savedImage = await this.imageRepository.save(newImage);

      const result = {
        ...savedImage, //creates obj with the new img properties
        id: savedImage._id.toHexString(), //converts the id to string
      };

      return result;
    } catch (error) {
      throw new Error(`Failed to create image. ${error.message}`);
    }
  }

  async update(
    id: string,
    updateImageDto: UpdateImageInput,
  ): Promise<ImageEntity> {
    try {
      //creates instance of ObjectId
      const objectId = new ObjectId(id);

      //fetches img entity from db with id
      const image = await this.imageRepository.findOne({
        where: { _id: objectId },
      });

      if (!image) {
        throw new NotFoundException(`Image with ID "${id}" not found`);
      }

      //merges the updates from updateImageDto to new obj
      Object.assign(image, updateImageDto);
      const updatedImage = await this.imageRepository.save(image);
      const updatedImages = {
        ...updatedImage,
        id: updatedImage._id.toHexString(),
      };

      return updatedImages;
    } catch (error) {
      throw new Error(`Failed to update image: ${error.message}`);
    }
  }

  async delete(id: string): Promise<ImageEntity> {
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException(`Image with ID "${id}" is invalid`);
    }
    const objectId = new ObjectId(id);

    const image = await this.imageRepository.findOneBy({ _id: objectId });
    if (!image) {
      throw new NotFoundException(`Image with ID "${id}" not found`);
    }

    const result = await this.imageRepository.delete({ _id: objectId });
    if (result.affected === 0) {
      throw new NotFoundException(`Failed to delete the image with ID "${id}"`);
    }

    const product = {
      ...image,
      id: image._id.toHexString(),
    };

    return product;
  }
}
