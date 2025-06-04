import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from 'src/app/services/user_service/user.service';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.updateValueAndValidity({ onlySelf: true });
    });
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.registerForm.updateValueAndValidity({ onlySelf: true });
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { firstName, lastName, username, password } =
        this.registerForm.value;

      const data = {
        firstName: firstName,
        lastName: lastName,
        email: username, // need to confirm this
        password: password,
        service: 'advance',
      };

      this.user.register(data).subscribe({
        next: (res: any) => {
          console.log('Registered successfully', res);
          this.snackBar.open('Signup successful!', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Registration failed', err);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}