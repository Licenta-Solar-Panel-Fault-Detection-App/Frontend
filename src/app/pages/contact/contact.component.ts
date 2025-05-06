import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  email = 'Markosfet@gmail.com';
  phone = '0743878698';

  constructor(
    private dialogRef: MatDialogRef<ContactComponent>,
    private clipboard: Clipboard
  ) {}

  copy(text: string) {
    this.clipboard.copy(text);
  }

  close() {
    this.dialogRef.close();
  }
}
