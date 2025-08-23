import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      phone: [''],
      license_number: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formValue = this.registerForm.value;
      const payload = {
        ...formValue,
        date_of_birth: formValue.dob ? new Date(formValue.dob).toISOString().slice(0, 10) : undefined
      };
      delete payload.dob;
      this.authService.register(payload).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.isLoading = false;
        }
      });
    }
  }
}
