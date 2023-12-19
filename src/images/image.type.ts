import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

//types define the shape of data that can be queried or mutated through the API, they specify the structure of objects

@ObjectType('Image')
export class ImageType {
  @Field(() => ID)
  id: string;

  @Field()
  url: string;

  @Field(() => Int)
  priority: number;
}
