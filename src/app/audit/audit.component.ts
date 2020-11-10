import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuditorService } from '../auditor/auditor.service';
import { Auditor } from '../auditor/auditor.model';
import { AuditService } from './audit.service';

import { MessageService } from '../core/message.service';
import { Audit } from './audit.model';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  constructor(
    public formBuilder: FormBuilder,
    public msgSvc: MessageService,
    public auditorSvc: AuditorService,
    public auditSvc: AuditService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  statuses: string[];

  auditors: Auditor[];
  selectedAuditors: Auditor[];

  form: FormGroup;

  $key: string;

  ngOnInit(): void {
    this.statuses = this.auditSvc.STATUSES;

    this.initForm();
    this.getAuditors();

    this.$key = this.activatedRoute.snapshot.params.key;
    if (this.$key) {
      this.loadFromKey(this.$key);
    } else {
      this.loadFromCache();
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      regulatoryOrg: [null, Validators.required],
      startingPeriod: [null, Validators.required],
      endingPeriod: [null, Validators.required],
      description: [null, Validators.required],
      status: [null, Validators.required],
      attachment: null,
      auditors: [null, Validators.required]
    });
  }

  async getAuditors() {
    this.auditors = await this.auditorSvc.index();
  }

  loadFromKey(key: string) {
    this.auditSvc.index({ $key: key }).then(res => {
      this.form.patchValue(res[0]);
      this.selectedAuditors = res[0].auditors;
    });
  }

  loadFromCache() {
    const cache = this.auditorSvc.getPrevFormCache();
    if (cache) {
      if (cache.$key) {
        this.$key = cache.$key;
      }
      this.form.patchValue(cache);
    }
  }

  selectFile(fileInput: any) {
    fileInput.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  startUpload(e: any) {
    MessageService.displayLoading();
    this.auditSvc.upload(e.target.files[0]).then(r => {
      this.form.patchValue({ attachment: r })
    }).finally(MessageService.hideLoading);
  }

  async store() {
    this.form.patchValue({ auditors: this.selectedAuditors });
    if (this.form.invalid) {
      this.msgSvc.displayWarnMessage('Por favor, preencha todos os dados obrigatórios!');
      return;
    }
    MessageService.displayLoading();
    const audit = new Audit(this.form.value);
    if (!this.$key) {
      await this.auditSvc.store(audit).then(
        () => {
           this.msgSvc.displaySuccessMessage('Auditoria cadastrada com sucesso!')
           this.router.navigate(['/home']);
        }
      ).finally(MessageService.hideLoading)
    } else {
      await this.auditSvc.update(this.$key, audit).then(
        () => {
          this.msgSvc.displaySuccessMessage('Auditoria atualizada com sucesso!')
          this.router.navigate(['/home']);
        }
      ).finally(MessageService.hideLoading)
    }
  }

  cacheCurrentFormData() {
    this.auditorSvc.setPrevFormCache({ $key: this.$key, ...this.form.value });
    this.router.navigate(['/auditor']);
  }
}
