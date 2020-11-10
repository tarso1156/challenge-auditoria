import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthServiceStub } from 'src/mocks/stubs';
import { APP_ROUTES } from '../routes';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {

  let service: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(APP_ROUTES)],
      providers: [{ provide: AuthService, useClass: AuthServiceStub }]
    });
    service = TestBed.inject(AuthGuard);
  });

  it('should navigate back to login when not authenticated',  async () => {
    const routerSpy = spyOn(service.router, 'navigate');

    await service.canActivate();

    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });
});
