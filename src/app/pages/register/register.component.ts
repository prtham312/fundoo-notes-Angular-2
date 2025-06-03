import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';


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
    MatCheckboxModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
  {
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.]+$/)
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
      ]
    ],
    confirmPassword: ['', Validators.required]
  },
  { validators: this.passwordMatchValidator }
);

  }

  passwordMatchValidator(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}
hidePassword = true;

togglePasswordVisibility() {
  this.hidePassword = !this.hidePassword;
}

onSubmit() {
  if (this.registerForm.valid) {
    console.log('Form Submitted', this.registerForm.value);
  } else {
    this.registerForm.markAllAsTouched();
  }
}

}

