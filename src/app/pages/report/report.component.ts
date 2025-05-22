import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import {ReportService} from '../../services/report/report.service';

@Component({
  selector: 'app-report',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
  standalone: true,
})

export class ReportComponent {

  reportForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private dialogRef: MatDialogRef<ReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reportForm = this.fb.group({
      description: [''],
    });
  }

  submit() {
    const user_id = localStorage.getItem('user_id');
    const numericUserId = user_id ? Number(user_id) : undefined;



    const description = this.reportForm.value.description;

    const payload = {
      panel_check_id: this.data.check_id,
      user_id: numericUserId,
      description: description
    };

    this.reportService.createReport(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error(err)
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

}
