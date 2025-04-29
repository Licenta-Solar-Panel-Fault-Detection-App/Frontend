import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {PanelService} from '../../services/panel/panel.service';

@Component({
  selector: 'app-delete-panel',
  imports: [ReactiveFormsModule],
  templateUrl: './delete-panel.component.html',
  styleUrl: './delete-panel.component.css',
  standalone: true
})
export class DeletePanelComponent {

  constructor(
    private panelService: PanelService,
    private dialogRef: MatDialogRef<DeletePanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  submit(){

    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      alert('User not authenticated');
      return;
    }

    const payload = {
      id: this.data.id,
    };

    this.panelService.delete(payload.id).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error(err)
    });

  }
  cancel(){
    this.dialogRef.close();
  }


}
