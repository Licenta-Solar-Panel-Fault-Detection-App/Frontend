import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/auth';

  constructor(private http: HttpClient) {}

  logout(): void {
    localStorage.removeItem('user_id');
  }

  register(userdata: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userdata);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  getUserInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user_id');
  }

  updateUsername(userId: string, username: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${userId}/update/username`, { username });
  }

  updateEmail(userId: string, email: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${userId}/update/email`, { email });
  }

  changePassword(userId: string, password: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${userId}/update/password`, { password });
  }


  deleteAccount(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/${userId}/delete`);
  }
}
