import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  userName = '';
  password = '';
  captchaInput = '';
  captchaValue = this.generateCaptcha();
  showPassword = false;
  isLoading = signal(false);
  errorMessage = signal('');

  private generateCaptcha(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  refreshCaptcha(): void {
    this.captchaValue = this.generateCaptcha();
    this.captchaInput = '';
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.userName || !this.password) {
      this.errorMessage.set('Please enter username and password.');
      return;
    }
    if (this.captchaInput !== this.captchaValue) {
      this.errorMessage.set('Captcha does not match. Please try again.');
      this.refreshCaptcha();
      return;
    }

    this.isLoading.set(true);
    this.authService.login({ userName: this.userName, password: this.password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/role-selection']);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Login failed. Please check your credentials.');
        this.refreshCaptcha();
      },
    });
  }
}
