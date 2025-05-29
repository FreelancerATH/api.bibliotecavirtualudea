import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Area from './Area';
import Semestre from './Semestre';

@Table({
  tableName: 'materia',
  timestamps: false,
})
class Materia extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true
  })
  declare idMateria: number;

  @Column(DataType.STRING)
  declare nombreMateria: string;

  @ForeignKey(() => Area)
  @Column(DataType.INTEGER)
  declare fkIdArea: number;

  @BelongsTo(() => Area)
  area?: Area;

  @ForeignKey(() => Semestre)
  @Column(DataType.INTEGER)
  declare fkIdSemestre: number;

  @BelongsTo(() => Semestre)
  semestre?: Semestre;
}

export default Materia;
