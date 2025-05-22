import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface ReportCreate {
  panel_check_id: number;
  user_id?: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl = 'http://localhost:8000/reports';

  constructor(private http: HttpClient) { }

  createReport(data: ReportCreate): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  updateReport(id: number, description: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, { description });
  }

  deleteReport(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  getReportByCheck(checkId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/check/${checkId}`);
  }

  getReportsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  getAllReports(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

}
