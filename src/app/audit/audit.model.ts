import { Auditor } from '../auditor/auditor.model';

export class Audit {

  $key?: string;
  regulatoryOrg: string;
  startingPeriod: Date;
  endingPeriod: Date;
  description: string;
  status: string;
  attachment?: string;
  auditors: Auditor[];

  constructor(auditData?: Partial<Audit>) {
    Object.assign(this, auditData);
  }
}
