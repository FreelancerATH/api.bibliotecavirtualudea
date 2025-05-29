import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BelongsTo,
  ForeignKey,
  BeforeCreate
} from 'sequelize-typescript';

import Area from './Area';
import Matricula from './Matricula';

@Table({
  tableName: 'alumno',
  timestamps: true,
})
class Alumno extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING(8),
    allowNull: false,
    unique: true,
  })
  declare matricula: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare nombre?: string;

  @Column({
    type: DataType.STRING(15), // Cambiado de BIGINT a STRING
    allowNull: false,
  })
  declare telefono?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare correo?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password?: string;

  @ForeignKey(() => Area)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare areaAcademica?: number;

  @BelongsTo(() => Area)
  area?: Area;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  declare codigoVerificacion?: string;

  @Default('alumno')
  @Column({
    type: DataType.ENUM('alumno'),
    defaultValue: 'alumno',
    allowNull: false,
  })
  declare rol: 'alumno';

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  declare verificado: boolean;

  // ✅ Validación para que la matrícula exista en la tabla Matricula
  @BeforeCreate
  static async validarMatriculaExistente(instance: Alumno) {
    const existe = await Matricula.findOne({ where: { matricula: instance.matricula } });
    if (!existe) {
      throw new Error(`La matrícula '${instance.matricula}' no está registrada en la tabla 'matricula'.`);
    }
  }
}

export default Alumno; 

