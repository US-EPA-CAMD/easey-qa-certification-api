import { Repository, EntityRepository } from 'typeorm';
import { MatsBulkFile } from '../entities/mats-bulk-file.entity';

@EntityRepository(MatsBulkFile)
export class MatsBulkFilesReviewAndSubmitRepository extends Repository<
  MatsBulkFile
> {}
