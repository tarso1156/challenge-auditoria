import { CommonModule, DatePipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditorService } from 'src/app/auditor/auditor.service';

import { MaterialModule } from 'src/app/core/material.module';
import { AuditorServiceStub, AuditServiceStub, MOCK_AUDIT } from 'src/mocks/stubs';
import { AuditService } from '../audit.service';

import { AuditCardComponent } from './audit-card.component';

describe('AuditCardComponent', () => {

  let component: AuditCardComponent;
  let fixture: ComponentFixture<AuditCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuditCardComponent,
        DatePipe
      ],
      imports: [
        CommonModule,
        MaterialModule
      ],
      providers: [
        { provide: AuditService, useClass: AuditServiceStub },
        { provide: AuditorService, useClass: AuditorServiceStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditCardComponent);
    component = fixture.componentInstance;

    component.audit = MOCK_AUDIT;
    component.ngOnInit();
  }));

  it('should open attachment', () => {
    const windowOpenSpy = spyOn(window, 'open');

    component.openAttachment();

    expect(windowOpenSpy).toHaveBeenCalled();
  });


  it('should open confirm dialog before deletion', () => {
    const windowOpenSpy = spyOn(window, 'confirm');

    component.confirmDeletion();

    expect(windowOpenSpy).toHaveBeenCalled();
  });

});
