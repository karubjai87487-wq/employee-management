import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:5001/api/leaves';

  constructor(private http: HttpClient) { }

  createLeaveRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/requests`, data);
  }

  getUserLeaves(): Observable<any> {
    return this.http.get(`${this.apiUrl}/requests`);
  }

  getLeaveBalance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/balance`);
  }

  getTeamLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/team-requests`);
  }

  getTeamBalances(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/team-balances`);
  }

  approveLeaveRequest(id: number, status: string, comment: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/requests/${id}/status`, { status, comment });
  }

  cancelLeaveRequest(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/requests/${id}/cancel`, {});
  }

  getCalendarData(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/calendar`, {
      params: { startDate, endDate }
    });
  }

  getCompanyReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/report`);
  }

  updateBalances(userId: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/balance/${userId}`, data);
  }
}
