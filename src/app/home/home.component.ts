import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AuthService } from '../core/auth.service';
import { AuditService } from '../audit/audit.service';
import { AuditorService } from '../auditor/auditor.service';

import { Audit } from '../audit/audit.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../core/message.service';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    public authSvc: AuthService,
    public auditSvc: AuditService,
    public auditorSvc: AuditorService,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog
  ) { }

  form: FormGroup;
  statuses: string[];
  audits: Audit[];
  subs: Subscription = new Subscription();

  ngOnInit(): void {
    this.statuses = this.auditSvc.STATUSES;

    this.initForm();
    this.loadAudits();

    this.subs.add(AuditService.reloadEvent.subscribe(() => this.loadAudits()));
  }

  initForm() {
    this.form = this.formBuilder.group({
      status: null
    });
    this.subs.add(this.form.valueChanges.subscribe(() => this.loadAudits()));
  }

  signOut() {
    this.authSvc.doLogout().then(() => location.reload());
  }

  async loadAudits() {
    MessageService.displayLoading();
    //cacheing auditors
    await this.auditorSvc.index();
    //loading data
    await this.auditSvc.index(this.form.value).then(r => this.audits = r)
      .finally(MessageService.hideLoading);
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  showAboutDialog() {
    this.matDialog.open(AboutDialogComponent);
  }
}
