import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}


  onRegister() {
    if (this.password !== this.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    this.authService.register({username: this.username, email: this.email, password: this.password}).subscribe({
      next: (response) => {
        console.log('Register with', this.username, this.email, this.password);
        localStorage.setItem('user_id', response.user_id);
        console.log('Register with', this.username, this.email, this.password);

        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Registration failed: ' + error);
      }
    });
  }
}
