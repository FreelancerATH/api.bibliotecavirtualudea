import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Area from './Area';

@Table({
  tableName: 'administradores',
  timestamps: true,
})
class Administrador extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  declare correo: string;

  @Column(DataType.STRING)
  declare nombre: string;

  @Column(DataType.STRING)
  declare telefono: string;

  @Column(DataType.STRING)
  declare password: string;

  @ForeignKey(() => Area)
  @Column(DataType.INTEGER)
  declare fkIdArea: number;

  @BelongsTo(() => Area)
  area?: Area;

  @Column(DataType.STRING)
  declare rol: string;

}



export default Administrador;
