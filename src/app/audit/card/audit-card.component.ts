import { Component, OnInit, Input } from '@angular/core';

import { AuditService } from '../audit.service';
import { AuditorService } from 'src/app/auditor/auditor.service';
import { Audit } from '../audit.model';

@Component({
  selector: 'app-audit-card',
  templateUrl: './audit-card.component.html',
  styleUrls: ['./audit-card.component.scss']
})
export class AuditCardComponent implements OnInit {

  constructor(public auditSvc: AuditService, public auditorSvc: AuditorService) { }

  @Input() audit: Audit;

  ngOnInit() {
    if (this.audit) {
      this.audit.auditors = this.audit.auditors.map(auditor => (this.auditorSvc.cache.find(cache => cache.$key === String(auditor))));
    }
  }

  openAttachment() {
    window.open(this.audit.attachment);
  }

  confirmDeletion() {
    const r = window.confirm('Deseja realmente deletar a auditoria?');
    if (r) {
      this.auditSvc.delete(this.audit.$key).then(() => AuditService.reloadEvent.emit(true));
    }
  }

  getChipClass() {
    return this.audit.status === 'Cancelado' ? 'red' : this.audit.status === 'Agendado' ? 'yellow' : 'green';
  }
}
