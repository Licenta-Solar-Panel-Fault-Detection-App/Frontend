import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import {PanelService} from '../../services/panel/panel.service';

@Component({
  selector: 'app-add-panel',
  templateUrl: './add-panel.component.html',
  styleUrls: ['./add-panel.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule
  ]
})
export class AddPanelComponent {
  panelForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private panelService: PanelService,
    private dialogRef: MatDialogRef<AddPanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.panelForm = this.fb.group({
      name: ['', Validators.required],
      latitude: [data?.latitude || '', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      longitude: [data?.longitude || '', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]]
    });
  }

  submit() {
    if (this.panelForm.valid) {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        alert('User not authenticated.');
        return;
      }

      const payload = {
        ...this.panelForm.value,
        user_id: parseInt(user_id)
      };

      this.panelService.add({name: payload.name, longitude: payload.longitude, latitude:payload.latitude, user_id: Number(user_id)}).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => console.error(err)
      });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
