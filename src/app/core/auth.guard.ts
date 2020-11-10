import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public authSvc: AuthService, public router: Router) {}

  async canActivate() {
    const loggedIn = !! await this.authSvc.getCurrentUser();
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }
    return loggedIn;
  }

}
