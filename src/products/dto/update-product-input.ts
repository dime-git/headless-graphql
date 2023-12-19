import { InputType, Field, Float } from '@nestjs/graphql';
import { UpdateProductImageInput } from 'src/product-image dto/update-product-image-input';

@InputType()
export class UpdateProductInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => [UpdateProductImageInput], { nullable: true })
  images?: UpdateProductImageInput[];
}
