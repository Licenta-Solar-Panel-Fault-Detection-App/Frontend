import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImageUploadService } from '../../services/image/image-upload.service';
import { ViewChild, ElementRef } from '@angular/core';
import {ReportComponent} from '../report/report.component';
import {MatDialog} from '@angular/material/dialog';
import {ReportService} from '../../services/report/report.service';
import { Location } from '@angular/common';

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

  isLoggedIn = false;
  selectedModel = 'resnet';
  models = ['resnet', 'vgg', 'efficientnet', 'mobilenet'];

  panelName: string | null = null;
  panelCoordinates: string | null = null;
  fileName: string = 'No file selected';
  predictionCheckId: number | null = null;
  hasReport: boolean = false;


  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  showCamera = false;
  private stream: MediaStream | null = null;

  constructor(
    private imageUploadService: ImageUploadService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    const state = history.state;
    if (state.panelId && state.panelName) {
      this.panelName = state.panelName;
      this.panelCoordinates = `Lat: ${state.panelLatitude}, Long: ${state.panelLongitude}, ID: ${state.panelId}`;
    } else {
      this.panelName = null;
      this.panelCoordinates = null;
    }
  }

  ngDoCheck(): void {
    const userId = localStorage.getItem('user_id');
    this.isLoggedIn = !!userId;

    if (this.prediction && this.predictionCheckId) {
      this.reportService.getReportByCheck(this.predictionCheckId).subscribe({
        next: (report) => {
          this.hasReport = !!report;
        },
        error: () => {
          this.hasReport = false;
        }
      });
    } else {
      this.hasReport = false;
    }
  }

  goBack(): void {
    this.location.back();
    //this.router.navigate(['/panels']);
  }

  selectModel(model: string): void {
    if (!this.isLoggedIn && model !== 'resnet') return;
    this.selectedModel = model;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.fileName = input.files[0].name;
      this.prediction = null;
      this.predictionCheckId = null;
      this.hasReport = false;




      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.fileName = 'No file selected';
    }
  }


  cancelImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.prediction = null;
    this.hasReport = false;
    this.predictionCheckId = null;

    this.fileName = 'No file selected';

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) return;
    this.loading = true;

    if (!this.selectedModel || !this.selectedFile) return;


    this.imageUploadService.uploadImage(this.selectedFile, this.selectedModel, history.state.panelId).subscribe({
      next: (response) => {
        this.prediction = response.prediction;
        this.predictionCheckId = response.check_id;
        this.loading = false;
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.prediction = 'Error while processing.';
        this.loading = false;
      }
    });
  }

  openCamera(): void {
    navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
      this.stream = stream;
      this.showCamera = true;

      setTimeout(() => {
        if (this.videoRef && this.videoRef.nativeElement) {
          this.videoRef.nativeElement.srcObject = stream;
          this.videoRef.nativeElement.play();
        }
      }, 100);
    }).catch((err) => {
      alert('Camera access denied or not available.');
      console.error(err);
    });
  }

  closeCamera(): void {
    this.showCamera = false;
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  captureFromCamera(): void {
    const video = this.videoRef.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/png');
      this.previewUrl = dataURL;
      this.fileName = 'captured.png';

      fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
          this.selectedFile = new File([blob], this.fileName, {type: 'image/png'});
        });
    }

    this.closeCamera();
  }


  sendReport(): void {
    const checkId = this.predictionCheckId;
    if (!checkId) return;

    this.dialog.open(ReportComponent, {
      data: {
        check_id: checkId
      },
      width: '500px'
    });
  }
}
