import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateImageInput {
  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => Int, { nullable: true })
  priority?: number;

  @Field(() => String, { nullable: true })
  productId?: string;
}
