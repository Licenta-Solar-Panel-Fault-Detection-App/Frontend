import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]

})
export class ProfileComponent implements OnInit {
  userId: string | null = null;
  username = '';
  email = '';

  editingUsername = false;
  editingEmail = false;
  showPasswordForm = false;

  newUsername = '';
  newEmail = '';

  passwordForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      newPassword: [''],
      retypePassword: ['']
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');
    if (this.userId) {
      this.authService.getUserInfo(this.userId).subscribe({
        next: (user) => {
          this.username = user.username;
          this.email = user.email;
        },
        error: (err) => console.error('Error fetching user:', err)
      });
    }
  }

  //Edit Username
  startEditUsername(): void {
    this.editingUsername = true;
    this.newUsername = this.username;
  }

  cancelEditUsername(): void {
    this.editingUsername = false;
  }

  saveUsername(): void {
    if (this.userId && this.newUsername !== this.username) {
      this.authService.updateUsername(this.userId, this.newUsername).subscribe({
        next: () => {
          this.username = this.newUsername;
          this.editingUsername = false;
        },
        error: (err) => console.error('Error updating username:', err)
      });
    }
  }

  //Edit Email
  startEditEmail(): void {
    this.editingEmail = true;
    this.newEmail = this.email;
  }

  cancelEditEmail(): void {
    this.editingEmail = false;
  }

  saveEmail(): void {
    if (this.userId && this.newEmail !== this.email) {
      this.authService.updateEmail(this.userId, this.newEmail).subscribe({
        next: () => {
          this.email = this.newEmail;
          this.editingEmail = false;
        },
        error: (err) => console.error('Error updating email:', err)
      });
    }
  }

  //Password Change
  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordForm.reset();
  }

  savePassword(): void {
    const { newPassword, retypePassword } = this.passwordForm.value;
    if (this.userId && newPassword === retypePassword) {
      this.authService.changePassword(this.userId, newPassword).subscribe({
        next: () => this.togglePasswordForm(),
        error: (err) => console.error('Error updating password:', err)
      });
    }
  }

  //Delete Account
  deleteAccount(): void {
    if (this.userId && confirm('Are you sure you want to delete your account?')) {
      this.authService.deleteAccount(this.userId).subscribe({
        next: () => {
          this.authService.logout();
          location.reload();
        },
        error: (err) => console.error('Error deleting account:', err)
      });
    }
  }

  //Helpers
  usernameChanged(): boolean {
    return this.newUsername.trim() !== '' && this.newUsername !== this.username;
  }

  emailChanged(): boolean {
    return this.newEmail.trim() !== '' && this.newEmail !== this.email;
  }

  canSavePassword(): boolean {
    const { newPassword, retypePassword } = this.passwordForm.value;
    return newPassword && newPassword === retypePassword;
  }

  get newPasswordControl(): FormControl {
    return this.passwordForm.get('newPassword') as FormControl;
  }

  get retypePasswordControl(): FormControl {
    return this.passwordForm.get('retypePassword') as FormControl;
  }

  protected readonly FormControl = FormControl;
}
