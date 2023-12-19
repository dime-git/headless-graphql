import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { ImageType } from './image.type';
import { CreateImageInput } from './dto/create-image-input';
import { UpdateImageInput } from './dto/update-image-input';

//resolvers are functions that provide the data and execute the logic required to respond to client queries and mutations and they can retrieve data from other sources such as API or DB

@Resolver(() => ImageType)
export class ImageResolver {
  constructor(private imageService: ImageService) {}

  @Query(() => [ImageType])
  async images() {
    return this.imageService.findAll();
  }

  @Query(() => ImageType, { nullable: true })
  async image(@Args('id') id: string) {
    return this.imageService.findOneById(id);
  }

  @Mutation(() => ImageType)
  async createImage(@Args('input') createImageInput: CreateImageInput) {
    return this.imageService.create(createImageInput);
  }

  @Mutation(() => ImageType)
  async updateImage(
    @Args('id') id: string,
    @Args('input') updateImageInput: UpdateImageInput,
  ) {
    return this.imageService.update(id, updateImageInput);
  }

  @Mutation(() => ImageType)
  async deleteImage(@Args('id') id: string) {
    return this.imageService.delete(id);
  }
}
