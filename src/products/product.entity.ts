import { Entity, ObjectIdColumn, ObjectId, Column, OneToMany } from 'typeorm';
import { ImageEntity } from '../images/image.entity';

//classes that map database tables they are defined with the help of the decorators which are provided by TypeORM

@Entity()
export class ProductEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column('int')
  quantity: number;

  @Column('float')
  price: number;

  @Column()
  status: string;

  @OneToMany(() => ImageEntity, (image) => image.product, {
    eager: true,
    cascade: true,
  })
  images: ImageEntity[];
}
