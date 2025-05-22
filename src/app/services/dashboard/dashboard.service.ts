import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  total_predictions: number;
  total_reported: number;
  models: {
    [model: string]: {
      total: number;
      reported: number;
    };
  };
}

export interface Prediction {
  id: number;
  panel_id: number | null;
  timestamp: string;
  model: string;
  status: string;
  image_path: string | null;
  report_id: number | null;
  description?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:8000/dashboard';
  private API = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getStats(userId: number): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats/${userId}`);
  }

  getPredictions(userId: number, reported?: boolean, model?: string): Observable<Prediction[]> {
    let params = new HttpParams().set('user_id', userId);

    if (reported !== undefined) {
      params = params.set('reported', reported);
    }

    if (model) {
      params = params.set('model', model);
    }

    return this.http.get<Prediction[]>(`${this.baseUrl}/predictions`, { params });
  }

  getAllPredictions(userId: number): Observable<Prediction[]> {
    return this.http.get<Prediction[]>(`${this.baseUrl}/predictions/all/${userId}`);
  }

  getReportByCheck(checkId: number) {
    return this.http.get<any>(`${this.API}/reports/check/${checkId}`);
  }

  deletePrediction(checkId: number) {
    return this.http.delete(`${this.API}/checks/delete/${checkId}`);
  }

  deleteReport(reportId: number) {
    return this.http.delete(`${this.API}/reports/delete/${reportId}`);
  }

  editReport(reportId: number, description: string) {
    return this.http.put(`${this.API}/reports/update/${reportId}`, { description });
  }

}
