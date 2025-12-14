import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResultsService } from './results.service';
import { Result } from '../models/result';
import { environment } from '../../environments/environment';

describe('ResultsService', () => {
  let service: ResultsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/api`;

  const mockResult: Result = {
    id: 1,
    ulid: 'result-ulid-1',
    labId: 1,
    nif: '12345678A',
    patientName: 'Juan Pérez',
    date: 1703376000000,
    data: 'Glucosa: 90 mg/dl',
    status: 'Finalizado'
  };

  const mockResults: Result[] = [
    mockResult,
    {
      id: 2,
      ulid: 'result-ulid-2',
      labId: 2,
      nif: '87654321B',
      patientName: 'María García',
      date: 1703462400000,
      data: 'Proteínas: Normal',
      status: 'Pendiente'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResultsService]
    });
    service = TestBed.inject(ResultsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los resultados', () => {
    service.getAllResults().subscribe(results => {
      expect(results).toEqual(mockResults);
      expect(results.length).toBe(2);
    });

    const req = httpMock.expectOne(`${apiUrl}/results`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResults);
  });

  it('debería obtener un resultado por ID', () => {
    const id = 1;

    service.getResultById(id).subscribe(result => {
      expect(result).toEqual(mockResult);
    });

    const req = httpMock.expectOne(`${apiUrl}/results/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResult);
  });

  it('debería crear un nuevo resultado', () => {
    const newResultData = {
      labId: 1,
      nif: '11111111C',
      patientName: 'Carlos López',
      date: Date.now(),
      data: 'Hemoglobina: 14 g/dl',
      status: 'Pendiente'
    };
    const createdResult = { ...newResultData, id: 3, ulid: 'result-ulid-3' };

    service.createResult(newResultData).subscribe(result => {
      expect(result).toEqual(createdResult);
    });

    const req = httpMock.expectOne(`${apiUrl}/results`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newResultData);
    req.flush(createdResult);
  });

  it('debería actualizar el estado de un resultado', () => {
    const id = 1;
    const newStatus = 'En Proceso';
    const updatedResult = { ...mockResult, status: newStatus };

    service.updateResultStatus(id, newStatus).subscribe(result => {
      expect(result).toEqual(updatedResult);
    });

    const req = httpMock.expectOne(`${apiUrl}/results/${id}/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: newStatus });
    req.flush(updatedResult);
  });

  it('debería eliminar un resultado', () => {
    const id = 1;

    service.deleteResult(id).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/results/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debería obtener resultados por laboratorio', () => {
    const labId = 1;
    const labResults = [mockResult];

    service.getResultsByLabId(labId).subscribe(results => {
      expect(results).toEqual(labResults);
    });

    const req = httpMock.expectOne(`${apiUrl}/results/lab/${labId}`);
    expect(req.request.method).toBe('GET');
    req.flush(labResults);
  });
});