import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value as any).subscribe({
      next: res => {
        if (res.rol === 'ADMIN') this.router.navigate(['/admin']);
        else if (res.rol === 'MOZO') this.router.navigate(['/mozo']);
        else if (res.rol === 'COCINA') this.router.navigate(['/cocina']);
        else if (res.rol === 'CAJERO') this.router.navigate(['/cajero']);
        else this.router.navigate(['/']);
      },
      error: () => this.error = 'Credenciales incorrectas'
    });
  }
}

