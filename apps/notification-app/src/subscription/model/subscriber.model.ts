import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { SubscriberStatus } from './subscriber-status.enum';

interface SubscriberCreationAttributes {
  email: string;
  status: string;
}

@Table({ tableName: 'subscriber' })
export class Subscriber extends Model<
  Subscriber,
  SubscriberCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.ENUM(SubscriberStatus.Active, SubscriberStatus.Disabled),
    allowNull: false,
  })
  status: string;
}
