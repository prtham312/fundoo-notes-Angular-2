import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService{

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      console.log('Access granted. Token:', token);
      return true;
    } else {
      console.log('Access denied. Redirecting to login.');
      this.router.navigate(['/login']);
      return false; 
    }
  }
}
