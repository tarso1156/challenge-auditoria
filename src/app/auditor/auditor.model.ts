export class Auditor {

  $key?: string;
  name: string;
  document: string;
  office: string;

  constructor(auditorData?: Partial<Auditor>) {
    Object.assign(this, auditorData);
  }
}
