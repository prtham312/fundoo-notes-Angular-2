import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/services/user_service/user.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

function emailOrPhoneValidator() {
  return (control: any) => {
    const value = control.value;

    if (!value) return null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    const isValidEmail = emailRegex.test(value);
    const isValidPhone = phoneRegex.test(value);

    return isValidEmail || isValidPhone ? null : { emailOrPhone: true };
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, emailOrPhoneValidator()]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*\d)[A-Za-z\d]{8,}$/),
        ],
      ],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login submitted:', email, password);
      let data = {
        email: email,
        password: password,
      };
      this.user.login(data).subscribe({
        next: (result: any) => {
          console.log(result);
          localStorage.setItem('token', result.id);
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched();
    }
  }
}