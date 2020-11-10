import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';

export interface EmailPwd {
  email: string;
  password: string;
  passwordConf: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  getCurrentUser() {
    return new Promise<any>((res, rej) => {
      firebase.auth().onAuthStateChanged(
        user => res(user),
        err => rej(err)
      );
    })
  }

  authEmailPwd(args: EmailPwd) {
    const { email, password } = args;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  authGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return this.afAuth.auth.signInWithPopup(provider);
  }

  signUpEmailPwd(args: EmailPwd) {
    const { email, password } = args;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  async isAuthenticated() {
    return !! await this.getCurrentUser();
  }

  doLogout() {
    localStorage.clear();
    return this.afAuth.auth.signOut();
  }
}
