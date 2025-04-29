import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {PanelService} from '../../services/panel/panel.service';

@Component({
  selector: 'app-edit-panel',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-panel.component.html',
  standalone: true,
  styleUrl: './edit-panel.component.css'
})
export class EditPanelComponent {
  panelForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private panelService: PanelService,
    private dialogRef: MatDialogRef<EditPanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.panelForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      latitude: [data?.latitude || '', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      longitude: [data?.longitude || '', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]]
    });
  }

  submit(){

    if (this.panelForm.invalid || !this.panelForm.dirty) {
      return;
    }


    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      alert('User not authenticated');
      return;
    }

    const payload = {
      id: this.data.id,
      ...this.panelForm.value,
      user_id: parseInt(user_id)
    };

    this.panelService.edit(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error(err)
    });

  }
  cancel(){
    this.dialogRef.close();
  }
}
