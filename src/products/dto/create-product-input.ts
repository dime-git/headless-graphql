import { InputType, Field } from '@nestjs/graphql';
import { CreateImageInput } from 'src/images/dto/create-image-input';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field({ defaultValue: 'active' })
  status: string;

  @Field(() => [CreateImageInput], { nullable: true })
  images?: CreateImageInput[];
}
