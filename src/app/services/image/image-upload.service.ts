import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private apiUrl = 'http://127.0.0.1:8000/predict/';

  constructor(private http: HttpClient) {}

  uploadImage(file: File, model: string, panelId?: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);
    if (panelId !== undefined) {
      formData.append('panel_id', panelId.toString());
    }
    return this.http.post(this.apiUrl, formData);
  }
}
