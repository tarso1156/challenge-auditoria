import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { MessageService } from '../core/message.service';
import { AuditorService } from './auditor.service';
import { Auditor } from './auditor.model';

@Component({
  selector: 'app-auditor',
  templateUrl: './auditor.component.html',
  styleUrls: ['./auditor.component.scss']
})
export class AuditorComponent implements OnInit {

  constructor(
    public formBuilder: FormBuilder,
    public msgSvc: MessageService,
    public auditorSvc: AuditorService,
    public location: Location
  ) { }

  form: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      document: [null, Validators.required],
      office: [null, Validators.required]
    });
  }

  async store() {
    if (this.form.invalid) {
      this.msgSvc.displayWarnMessage('Por favor, preencha todos os dados obrigatórios!');
      return;
    }
    MessageService.displayLoading();
    const auditor = new Auditor(this.form.value);
    await this.auditorSvc.store(auditor)
      .then(() => {
        this.msgSvc.displaySuccessMessage('Auditor cadastrado com sucesso!');
        this.location.back();
      })
      .catch(() => this.msgSvc.displayErrorMessage('Ocorreu um erro ao cadastrar o auditor!'))
      .finally(MessageService.hideLoading);
  }

}
