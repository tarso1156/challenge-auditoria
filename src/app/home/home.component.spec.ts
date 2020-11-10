import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuditorServiceStub, AuditServiceStub, AuthServiceStub } from 'src/mocks/stubs';
import { AuditService } from '../audit/audit.service';
import { AuditorService } from '../auditor/auditor.service';
import { AuthService } from '../core/auth.service';
import { MaterialModule } from '../core/material.module';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: AuditService, useClass: AuditServiceStub },
        { provide: AuditorService, useClass: AuditorServiceStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    component.initForm();
  }));

  it('should create filter form controls', () => {
    expect(component.form).toBeDefined();
    expect(component.form).toBeInstanceOf(FormGroup);
  });

  it('should load data when filter form changes', () => {
    const loadDataSpy = spyOn(component, 'loadAudits');

    component.form.patchValue({ status: 'Dummy status' });

    expect(loadDataSpy).toHaveBeenCalled();
  });

  it('should load data when started', () => {
    const loadDataSpy = spyOn(component, 'loadAudits');

    component.ngOnInit();

    expect(loadDataSpy).toHaveBeenCalled();
  });
});
