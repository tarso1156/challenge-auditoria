import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, EmailPwd } from '../core/auth.service';
import { MessageService } from '../core/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public authSvc: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    public msgSvc: MessageService,
    public nz: NgZone
  ) { }

  selectedIndex = 0;
  loginForm: FormGroup;
  entryForm: FormGroup;
  hidePwd = { login: true, signIn: true, signInConf: true };

  ngOnInit() {
    this.authenticated();
    this.initForms();
  }

  initForms() {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
    this.entryForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordConf: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  signIn() {
    if (!this.loginForm.valid) {
      this.msgSvc.displayWarnMessage('Por favor, preencha seu e-mail e senha corretamente!');
      return;
    }
    MessageService.displayLoading();
    this.authSvc.authEmailPwd(this.loginForm.value).then(
      () => this.authenticated(),
      () => {
        this.msgSvc.displayErrorMessage('Falha ao realizer o login! Por favor, verifique seus dados e tente novamente.');
        this.loginForm.patchValue({ password: null });
      }
    ).finally(MessageService.hideLoading);
  }

  signUp() {
    if (!this.entryForm.valid) {
      this.msgSvc.displayWarnMessage('Por favor, preencha todos os dados do formulário!');
      return;
    }
    const emailPwd = <EmailPwd>{ ...this.entryForm.value };
    if (!this.validatePasswordConf(emailPwd)) {
      return;
    }
    MessageService.displayLoading();
    this.authSvc.signUpEmailPwd(emailPwd).then(
      () => {
        this.selectedIndex = 0;
        this.loginForm.reset({ email: emailPwd.email })
        this.entryForm.reset();
        this.entryForm.markAsUntouched();
        this.msgSvc.displaySuccessMessage('Login cadastrado com sucesso!');
      },
      () => {
        this.msgSvc.displayWarnMessage('Não foi possível concluir o cadastro! Verifique se você já não cadastrou préviamente.');
      }
    ).finally(MessageService.hideLoading);
  }

  validatePasswordConf(emailPwd: EmailPwd) {
    if (emailPwd.password !== emailPwd.passwordConf) {
      this.msgSvc.displayWarnMessage('A senha de confirmação está divergente da senha original!');
      return false;
    }
    return true;
  }

  enterKeyDown(e: any) {
    e.preventDefault();
    this[(this.selectedIndex === 0 ? 'signIn' : 'signUp')]();
  }

  async authenticated() {
    if (await this.authSvc.isAuthenticated()) {
      this.nz.run(() => this.router.navigate(['/home']));
    }
  }

  async signInWithGoogle() {
    await this.authSvc.authGoogle().then(
      () => this.authenticated(),
      () => this.msgSvc.displayWarnMessage('Não foi possível autenticar via Google!')
    );
  }
}
