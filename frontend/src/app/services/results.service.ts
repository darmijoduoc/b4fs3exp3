import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../models/result';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private apiUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) { }

  // Obtener todos los resultados
  getAllResults(): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/results`);
  }

  // Obtener resultado por ID
  getResultById(id: number): Observable<Result> {
    return this.http.get<Result>(`${this.apiUrl}/results/${id}`);
  }

  // Obtener resultado por ULID
  getResultByUlid(ulid: string): Observable<Result> {
    return this.http.get<Result>(`${this.apiUrl}/results/ulid/${ulid}`);
  }

  // Obtener resultados por laboratorio
  getResultsByLabId(labId: number): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/results/lab/${labId}`);
  }

  // Obtener resultados por paciente (NIF)
  getResultsByPatient(nif: string): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/results/patient/${nif}`);
  }

  // Obtener resultados por estado
  getResultsByStatus(status: string): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/results/status/${status}`);
  }

  // Crear nuevo resultado
  createResult(result: Omit<Result, 'id' | 'ulid'>): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/results`, result);
  }

  // Actualizar resultado
  updateResult(id: number, result: Partial<Result>): Observable<Result> {
    return this.http.put<Result>(`${this.apiUrl}/results/${id}`, result);
  }

  // Actualizar estado del resultado
  updateResultStatus(id: number, status: string): Observable<Result> {
    return this.http.patch<Result>(`${this.apiUrl}/results/${id}/status`, { status });
  }

  // Eliminar resultado
  deleteResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/results/${id}`);
  }

  // Buscar resultados por nombre de paciente
  searchResultsByPatientName(patientName: string): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/results/search?patientName=${encodeURIComponent(patientName)}`);
  }

  // Obtener resultados por rango de fechas
  getResultsByDateRange(startDate: number, endDate: number): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/results/date-range?start=${startDate}&end=${endDate}`);
  }

  // Filtrar resultados con múltiples criterios
  filterResults(filters: {
    labId?: number;
    nif?: string;
    patientName?: string;
    status?: string;
    startDate?: number;
    endDate?: number;
  }): Observable<Result[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return this.http.get<Result[]>(`${this.apiUrl}/results/filter?${params.toString()}`);
  }
}
