import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class Scrape {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;

  @Column({ type: 'varchar', length: 255 })
  date: string;
}
