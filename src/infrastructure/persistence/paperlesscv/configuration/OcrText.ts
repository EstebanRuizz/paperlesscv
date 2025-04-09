import {
  Model,
  Table,
  Column,
  DataType,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'ocrText', timestamps: false })
export class OcrText extends Model<OcrText> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  public Id: string;

  @Column({ type: DataType.TEXT })
  public Text: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  public createdDate: Date;
}
