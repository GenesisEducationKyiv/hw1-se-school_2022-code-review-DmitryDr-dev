import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { CustomerStatus } from './customer-status.enum';

interface CustomerCreationAttributes {
  email: string;
  status: string;
}

@Table({ tableName: 'customer' })
export class Customer extends Model<Customer, CustomerCreationAttributes> {
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
    type: DataType.ENUM(CustomerStatus.Active, CustomerStatus.Disabled),
    allowNull: false,
  })
  status: string;
}
