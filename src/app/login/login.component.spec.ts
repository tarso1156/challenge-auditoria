import { NgZone } from '@angular/core';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthServiceStub, MessageServiceStub } from 'src/mocks/stubs';

import { AuthService, EmailPwd } from '../core/auth.service';
import { MaterialModule } from '../core/material.module';
import { MessageService } from '../core/message.service';
import { APP_ROUTES } from '../routes';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  function doMockAuthUser() {
    const mockUser = { uid: 12345 };

    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'getCurrentUser').and.returnValue(Promise.resolve(mockUser));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(APP_ROUTES),
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: MessageService, useClass: MessageServiceStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.initForms();

  }));

  it('should create login form controls', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm).toBeInstanceOf(FormGroup);
  });

  it('should create signup form controls', () => {
    expect(component.entryForm).toBeDefined();
    expect(component.entryForm).toBeInstanceOf(FormGroup);
  });

  it('should validate password confirmation correctly', () => {
    const entryData: EmailPwd = {
      email: 'test@mail.com',
      password: 'p@ssw0rd',
      passwordConf: 'p@ssw0rdd'
    };

    const invalidConf = component.validatePasswordConf(entryData);
    expect(invalidConf).toBeFalse();

    entryData.passwordConf = entryData.password;

    const validConf = component.validatePasswordConf(entryData);
    expect(validConf).toBeTrue();
  });

  it('should navigate to /home when already authenticated', async () => {
    doMockAuthUser();

    const ngZoneService = fixture.debugElement.injector.get(NgZone);
    const ngZoneRunSpy = spyOn(ngZoneService, 'run').and.callThrough();

    const routerSpy = spyOn(component.router, 'navigate');

    await component.authenticated();

    expect(ngZoneRunSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /home when signed in/up with google', async () => {
    doMockAuthUser();

    const ngZoneService = fixture.debugElement.injector.get(NgZone);
    const ngZoneRunSpy = spyOn(ngZoneService, 'run').and.callThrough();

    const routerSpy = spyOn(component.router, 'navigate');

    await component.signInWithGoogle();

    expect(ngZoneRunSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should display warning message when invalid sign in form data', () => {
    const messageService = fixture.debugElement.injector.get(MessageService);
    const warnMessageSpy = spyOn(messageService, 'displayWarnMessage');

    component.signIn();

    expect(warnMessageSpy).toHaveBeenCalled();
  });

  it('should display success message when signed up successfully', async () => {
    const messageService = fixture.debugElement.injector.get(MessageService);
    const successMessage = spyOn(messageService, 'displaySuccessMessage');

    const entryData: EmailPwd = {
      email: 'test@mail.com',
      password: 'p@ssw0rd',
      passwordConf: 'p@ssw0rd'
    };

    component.entryForm.patchValue(entryData);

    await component.signUp();

    expect(successMessage).toHaveBeenCalled();
  });

});
