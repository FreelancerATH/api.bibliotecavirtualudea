// models/Matricula.ts

import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Unique
  } from 'sequelize-typescript';
  
  @Table({
    tableName: 'matricula',
    timestamps: false,
  })
  class Matricula extends Model {
    @PrimaryKey
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
    })
    declare id: number;
  
    @Unique
    @Column({
      type: DataType.STRING(8),
      allowNull: false,
    })
    declare matricula: string;
  }
  
  export default Matricula; 