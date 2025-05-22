import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';

export interface Panel {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  user_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  private baseUrl = 'http://localhost:8000/panels';

  constructor(private http: HttpClient) { }

  add(paneldata: {name: string, latitude: number, longitude:number, user_id: number }) : Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, paneldata);
  }

  edit(paneldata: {id: number, name: string, latitude: number, longitude:number, user_id: number }) : Observable<any> {
    return this.http.put(`${this.baseUrl}/edit/${paneldata.id}`, paneldata);
  }

  delete(id:number): Observable<any>{
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
  getByUser(user_id: number): Observable<Panel[]> {
    return this.http.get<Panel[]>(`${this.baseUrl}/get/${user_id}`);
  }

  getChecksByPanel(panelId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8000/checks/panel/${panelId}`);
  }

  getLastStatusByPanel(panelId: number): Observable<{ status: string, timestamp: string | null }> {
    return this.http.get<{ status: string, timestamp: string | null }>(`http://localhost:8000/checks/last-status/${panelId}`);
    }

}
