import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lab } from '../models/lab';

@Injectable({
  providedIn: 'root'
})
export class LabsService {

  private readonly apiUrl = `${environment.apiBaseUrl}/labs`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Lab[]> {
    return this.http.get<Lab[]>(this.apiUrl);
  }

  getById(id: number): Observable<Lab> {
    return this.http.get<Lab>(`${this.apiUrl}/${id}`);
  }

  getByUlid(ulid: string): Observable<Lab> {
    return this.http.get<Lab>(`${this.apiUrl}/ulid/${ulid}`);
  }

  getByKeyName(keyName: string): Observable<Lab> {
    return this.http.get<Lab>(`${this.apiUrl}/key/${keyName}`);
  }

  create(keyName: string, name: string, description: string): Observable<Lab> {
    const data = { keyName, name, description };
    return this.http.post<Lab>(this.apiUrl, data);
  }

  update(ulid: string, keyName: string, name: string, description: string): Observable<Lab> {
    const data = { keyName, name, description };
    return this.http.patch<Lab>(`${this.apiUrl}/${ulid}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
