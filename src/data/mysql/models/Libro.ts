import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Area from './Area';
import Semestre from './Semestre';
import Materia from './Materia';

@Table({
  tableName: 'libros',
  timestamps: true,  
})
class Libro extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true
  })
  declare idLibro: number;

  @Column(DataType.STRING)
  declare nombreLibro: string;

  @Column(DataType.STRING)
  declare descripcion: string;  

  @Column(DataType.STRING)
  declare autor: string;  

  @Column(DataType.STRING)
  declare archivoUrl: string;  

  @Column(DataType.STRING)
  declare portadaUrl: string;  

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

  @ForeignKey(() => Materia)
  @Column(DataType.INTEGER)
  declare fkIdMateria: number;

  @BelongsTo(() => Materia)
  materia?: Materia;
}

export default Libro;
