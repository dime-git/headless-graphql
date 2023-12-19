import { InputType, Field, Int } from '@nestjs/graphql';

//DTO(Data Transfer Objects) are objects that define how data will be sent to and from the server

@InputType()
export class CreateImageInput {
  @Field()
  url: string;

  @Field(() => Int, { defaultValue: 1000 })
  priority: number;
}
