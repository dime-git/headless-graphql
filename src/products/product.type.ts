import { Field, ObjectType, ID } from '@nestjs/graphql';
import { ImageType } from '../images/image.type';

//types define the shape of data that can be queried or mutated through the API, they specify the structure of objects, including fields and their data types

@ObjectType('Product')
export class ProductType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  status: string;

  @Field(() => [ImageType], { nullable: true })
  images?: ImageType[];
}
