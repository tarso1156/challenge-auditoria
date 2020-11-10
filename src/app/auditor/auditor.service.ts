import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Auditor } from './auditor.model';

export const AUDITOR_REF_PATH = '/auditor';

@Injectable({
  providedIn: 'root'
})
export class AuditorService {

  constructor(public afDb: AngularFireDatabase) { }

  cache: Auditor[];
  private _prevFormCache: any;

  store(auditor: Auditor) {
    return this.afDb.list(AUDITOR_REF_PATH).push(auditor);
  }

  index(): Promise<Auditor[]> {
    return new Promise<Auditor[]>((res) => {
      this.afDb.list(AUDITOR_REF_PATH).snapshotChanges().subscribe(v => {
        this.cache = v.map(i => new Auditor(Object.assign({ $key: i.key }, i.payload.val())));
        res(this.cache);
      });
    });
  }

  setPrevFormCache(data: any) {
    this._prevFormCache = data;
  }

  getPrevFormCache() {
    const ret = this._prevFormCache;
    this._prevFormCache = null;
    return ret;
  }
}
