import { Table, Column, Model, DataType, HasMany, PrimaryKey } from 'sequelize-typescript';
import Alumno from './Alumno';
import Semestre from './Semestre';
import Materia from './Materia';

@Table({
  tableName: 'area',
  timestamps: false,
})
class Area extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false
  })
  declare nombreArea: string;

  @HasMany(() => Alumno)  
  alumnos?: Alumno[];

  @HasMany(() => Semestre)
  semestres?: Semestre[];

  @HasMany(() => Materia)
  materias?: Materia[];
}

export default Area;
