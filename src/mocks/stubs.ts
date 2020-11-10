import { Audit } from 'src/app/audit/audit.model';
import { Auditor } from 'src/app/auditor/auditor.model';
import { EmailPwd } from 'src/app/core/auth.service';

export const MOCK_AUDITOR = new Auditor({
  name: 'Jao Doeh',
  document: '123.456.789-99',
  office: 'Jao Doehs office'
});

export const MOCK_AUDIT = new Audit({
  regulatoryOrg: 'Dummy regulatory org',
  startingPeriod: new Date(),
  endingPeriod: new Date(),
  description: 'Dummy description',
  status: 'Dummy status',
  attachment: 'https://dummyimage.com/600x400/000/fff',
  auditors: [MOCK_AUDITOR]
});

export class MessageServiceStub {

  static showLoadingFidget = false;
  static pendingRequests = 0;

  static displayLoading() { }

  static hideLoading() { }

  displayMessage(message: string, style: string = 'success') { }

  displayWarnMessage(message: string) {
    this.displayMessage(message, 'warn');
  }

  displayErrorMessage(message: string) {
    this.displayMessage(message, 'error');
  }

  displaySuccessMessage(message: string) {
    this.displayMessage(message);
  }

}

export class AuthServiceStub {

  getCurrentUser() {
    return new Promise((resolve) => resolve(false));
  }

  authEmailPwd(args: EmailPwd) {
    return new Promise(() => {});
  }

  authGoogle() {
    return new Promise((resolve) => resolve(true));
  }

  signUpEmailPwd(args: EmailPwd) {
    return new Promise((resolve) => resolve(args));
  }

  async isAuthenticated() {
    return !! await this.getCurrentUser();
  }

  doLogout() {
    return new Promise((resolve) => resolve(true));
  }
}

export class AuditServiceStub {

  readonly STATUSES = ['Dummy status'];

  store(audit: Audit) {
    return new Promise<Audit>((resolve) => resolve(audit));
  }

  update($key: string, audit: Audit) {
    audit.$key = $key;
    return new Promise<Audit>((resolve) => resolve(audit));
  }

  index(filterData?: { $key?: string, status?: string }): Promise<Audit[]> {
    return new Promise<Audit[]>((resolve) => resolve([MOCK_AUDIT]));
  }

  upload(file: File) { }

  delete($key: string) { }

}

export class AuditorServiceStub {

  cache: Auditor[] = [MOCK_AUDITOR];
  private _prevFormCache: any;

  store(auditor: Auditor) {
    return new Promise<Auditor>((resolve) => resolve(auditor));
  }

  index(): Promise<Auditor[]> {
    return new Promise<Auditor[]>((resolve) => {
      resolve(this.cache);
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
