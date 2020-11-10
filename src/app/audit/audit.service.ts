import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireDatabase, QueryFn } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { Audit } from './audit.model';

export const AUDIT_REF_PATH = '/audit';
export const AUDIT_ATTCH_REF_PATH = 'audit/attachments';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(public afDb: AngularFireDatabase, public afSg: AngularFireStorage) { }

  public static reloadEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  readonly STATUSES = [
    'Agendado', 'Cancelado', 'Confirmado'
  ];

  private _serialize(audit: Audit) {
    return {
      ...audit,
      startingPeriod: audit.startingPeriod.getTime().toString(),
      endingPeriod: audit.endingPeriod.getTime().toString()
    };
  }

  store(audit: Audit) {
    const $audit = this._serialize(audit);
    return this.afDb.list(AUDIT_REF_PATH).push($audit);
  }

  update($key: string, audit: Audit) {
    const $audit = this._serialize(audit);
    return this.afDb.list(AUDIT_REF_PATH).update($key, $audit);
  }

  index(filterData?: { $key?: string, status?: string }): Promise<Audit[]> {
    return new Promise<Audit[]>((res) => {
      let queryFunction: QueryFn;
      if (filterData) {
        queryFunction = (ref => {
          if (filterData.status) {
            return ref.orderByChild('status').equalTo(filterData.status);
          }
          if (filterData.$key) {
            return ref.orderByKey().equalTo(filterData.$key);
          }
          return ref;
        });
      }
      this.afDb.list(AUDIT_REF_PATH, queryFunction).snapshotChanges().subscribe(
        v => res(v.map(i => new Audit(
          Object.assign(i.payload.val(), {
            $key: i.key,
            startingPeriod: new Date( parseInt(i.payload.val()['startingPeriod'].toString()) ),
            endingPeriod: new Date( parseInt(i.payload.val()['endingPeriod'].toString()) )
          })
        )))
      );
    });
  }

  upload(file: File) {
    return new Promise<string>((res) => {
      const path = `${AUDIT_ATTCH_REF_PATH}/${file.name}`;
      const ref = this.afSg.ref(path);
      this.afSg.upload(path, file).then(r => {
        ref.getDownloadURL().subscribe(url => {
          res(url);
        })
      });
    });
  }

  delete($key: string) {
    return this.afDb.object(`${AUDIT_REF_PATH}/${$key}`).remove();
  }
}
