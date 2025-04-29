import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router ) {}

  onLogin() {
    console.log('Login with', this.email, this.password);

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          localStorage.setItem('user_id', response.user_id);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Email sau parolă incorecte.');
        }
      });
  }
}
