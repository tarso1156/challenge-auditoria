import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuditorServiceStub, AuditServiceStub, MessageServiceStub, MOCK_AUDIT, MOCK_AUDITOR } from 'src/mocks/stubs';

import { MaterialModule } from 'src/app/core/material.module';
import { AuditComponent } from './audit.component';

import { MessageService } from '../core/message.service';
import { AuditService } from './audit.service';
import { APP_ROUTES } from '../routes';
import { AuditorService } from '../auditor/auditor.service';

describe('AuditComponent', () => {

  let component: AuditComponent;
  let fixture: ComponentFixture<AuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(APP_ROUTES),
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MessageService, useClass: MessageServiceStub },
        { provide: AuditorService, useClass: AuditorServiceStub },
        { provide: AuditService, useClass: AuditServiceStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditComponent);
    component = fixture.componentInstance;
    component.initForm();
  }));

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should init form correctly', () => {
    expect(component.form).toBeDefined();
    expect(component.form).toBeInstanceOf(FormGroup);
  });

  it('should get auditors', async () => {
    const auditorService = fixture.debugElement.injector.get(AuditorService);
    spyOn(auditorService, 'index').and.returnValue(Promise.resolve([MOCK_AUDITOR]));

    await component.getAuditors();

    expect(component.auditors.length).toBeGreaterThan(0);
  });

  it('should display warning message when form invalid', () => {
    const messageService = fixture.debugElement.injector.get(MessageService);
    const warnMessageSpy = spyOn(messageService, 'displayWarnMessage');

    component.store();

    expect(warnMessageSpy).toHaveBeenCalled();
  });

  it('should display success message when stored successfully', async () => {
    const messageService = fixture.debugElement.injector.get(MessageService);
    const successMessageSpy = spyOn(messageService, 'displaySuccessMessage');

    component.form.patchValue(MOCK_AUDIT);
    component.selectedAuditors = MOCK_AUDIT.auditors;

    expect(component.form.valid).toBeTruthy();
    await component.store();
    expect(successMessageSpy).toHaveBeenCalled();
  });

  it('should display success message when updated successfully', async () => {
    const messageService = fixture.debugElement.injector.get(MessageService);
    const successMessageSpy = spyOn(messageService, 'displaySuccessMessage');

    component.$key = '123';
    component.form.patchValue(MOCK_AUDIT);
    component.selectedAuditors = MOCK_AUDIT.auditors;

    expect(component.form.valid).toBeTruthy();
    await component.store();
    expect(successMessageSpy).toHaveBeenCalled();
  });

  it('should navigate to /home when stored successfully', async () => {
    const routerSpy = spyOn(component.router, 'navigate');

    component.form.patchValue(MOCK_AUDIT);
    component.selectedAuditors = MOCK_AUDIT.auditors;

    expect(component.form.valid).toBeTruthy();
    await component.store();
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /home when updated successfully', async () => {
    const routerSpy = spyOn(component.router, 'navigate');

    component.$key = '123';
    component.form.patchValue(MOCK_AUDIT);
    component.selectedAuditors = MOCK_AUDIT.auditors;

    expect(component.form.valid).toBeTruthy();
    await component.store();
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  });

});
