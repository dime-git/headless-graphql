import { Entity, ObjectIdColumn, Column, ObjectId, ManyToOne } from 'typeorm';
import { ProductEntity } from 'src/products/product.entity';

//classes that map database tables to collections and they are defined with the help of the decorators which are provided by TypeORM

@Entity() //decorator for class as a db table
export class ImageEntity {
  @ObjectIdColumn() //maps a mongoDB Object field
  _id: ObjectId;

  @Column()
  url: string;

  @Column({ default: 1000 })
  priority: number;

  //entity relationship between images and products
  @ManyToOne(() => ProductEntity, (product) => product.images)
  product: ProductEntity;
}
