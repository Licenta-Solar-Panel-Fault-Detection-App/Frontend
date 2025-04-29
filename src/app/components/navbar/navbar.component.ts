import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngDoCheck(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log("logged in?", this.isLoggedIn);
  }

  goToQuickCheck() {
    this.router.navigate(['/quick-check']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    //this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
