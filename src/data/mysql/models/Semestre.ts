import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Area from './Area';
import Materia from './Materia';

@Table({
  tableName: 'semestre',
  timestamps: false,
})
class Semestre extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true
  })
  declare idSemestre: number;

  @Column(DataType.STRING)
  declare nombreSemestre: string;

  @ForeignKey(() => Area)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare fkIdArea: number;

  @BelongsTo(() => Area)
  area?: Area;

  @HasMany(() => Materia)
  materias?: Materia[];
}

export default Semestre;
