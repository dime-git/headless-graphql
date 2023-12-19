import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductImageInput {
  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => Int, { nullable: true })
  priority?: number;
}
