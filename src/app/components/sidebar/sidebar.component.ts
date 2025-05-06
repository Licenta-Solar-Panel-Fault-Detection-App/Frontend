import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {ContactComponent} from '../../pages/contact/contact.component';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isLoggedIn = false;

  constructor(private router: Router, private dialog: MatDialog) {}

  openContact() {
    this.dialog.open(ContactComponent, { width: '450px' });
  }

  ngDoCheck(): void {
    this.isLoggedIn = !!localStorage.getItem('user_id');
  }
  isActive(path: string): boolean {
    return this.router.url === path;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
