import {
    BaseEntity,
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { QASuppData } from './qa-supp-data.entity';
  
@Entity({ name: 'camdecmps.qa_supp_attribute' })
export class QASuppAttribute extends BaseEntity {
    @PrimaryColumn({
        name: 'qa_supp_attribute_id',
      })
    id: string;
    
    @Column({
      name: 'qa_supp_data_id',
    })
    qaSuppDataId: string;

    @ManyToOne(
      () => QASuppData,
    )
    @JoinColumn({ name: 'qa_supp_data_id' })
    qaSuppData: QASuppData;

    @Column({
      name: 'attribute_name',
    })
    attributeName: string;

    @Column({
      name: 'attribute_value',
    })
    attributeValue: string;

    @Column({
      name: 'userid',
    })
    userid: string;

    @Column({
      type: 'timestamp',
      name: 'add_date',
    })
    addDate: Date;

    @Column({
      type: 'timestamp',
      name: 'update_date',
    })
    updateDate: Date;
}