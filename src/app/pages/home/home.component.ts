import {Component, computed} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    NgOptimizedImage,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLoggedIn = false;
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngDoCheck(): void {
    const userId = localStorage.getItem('user_id');
    this.isLoggedIn = !!userId;

    if (!userId) {
      this.username = '';
      return;
    }

    if (userId && !this.username) {
      this.authService.getUserInfo(userId).subscribe({
        next: (user) => this.username = user.username.charAt(0).toUpperCase() + user.username.slice(1),
        error: (err) => console.error('Error fetching user info:', err)
      });
    }
  }
}
