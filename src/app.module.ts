import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { ProductResolver } from './products/product.resolver';
import { ImageResolver } from './images/image.resolver';
import { ProductService } from './products/product.service';
import { ImageService } from './images/image.service';
import { ProductEntity } from './products/product.entity';
import { ImageEntity } from './images/image.entity';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://propellerbackendassignment:propeller@propeller-assignment.nied3i4.mongodb.net/',
      entities: [ProductEntity, ImageEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ProductEntity, ImageEntity]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    ProductResolver,
    ImageResolver,
    ProductService,
    ImageService,
    AppService,
  ], //handles GraphQL operations
})
export class AppModule {}
