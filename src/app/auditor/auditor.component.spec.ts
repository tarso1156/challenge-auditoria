import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';

import { AuditorServiceStub, MessageServiceStub, MOCK_AUDITOR } from 'src/mocks/stubs';

import { MaterialModule } from 'src/app/core/material.module';
import { AuditorComponent } from './auditor.component';

import { MessageService } from '../core/message.service';
import { AuditorService } from './auditor.service';
import { APP_ROUTES } from '../routes';

describe('AuditorComponent', () => {

  let component: AuditorComponent;
  let fixture: ComponentFixture<AuditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditorComponent],
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
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditorComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  }));

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should init form correctly', () => {
    expect(component.form).toBeDefined();
    expect(component.form).toBeInstanceOf(FormGroup);
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

    component.form.patchValue(MOCK_AUDITOR);

    expect(component.form.valid).toBeTruthy();
    await component.store();
    expect(successMessageSpy).toHaveBeenCalled();
  });

  it('should navigate back when stored successfully', async () => {
    const locationService = fixture.debugElement.injector.get(Location);
    const backLocationSpy = spyOn(locationService, 'back');

    component.form.patchValue(MOCK_AUDITOR);

    expect(component.form.valid).toBeTruthy();
    await component.store();
    expect(backLocationSpy).toHaveBeenCalled();
  });

});
