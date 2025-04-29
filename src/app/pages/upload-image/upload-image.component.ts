import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {ImageUploadService} from '../../services/image/image-upload.service';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  prediction: string | null = null;
  loading = false;

  constructor(private imageUploadService: ImageUploadService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) return;
    this.loading = true;

    this.imageUploadService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.prediction = response.prediction;
        this.loading = false;
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.prediction = 'Eroare la procesare.';
        this.loading = false;
      }
    });
  }
}
