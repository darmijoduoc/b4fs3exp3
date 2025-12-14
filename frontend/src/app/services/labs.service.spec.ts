import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LabsService } from './labs.service';
import { Lab } from '../models/lab';
import { environment } from '../../environments/environment';

describe('LabsService', () => {
  let service: LabsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/labs`;

  const mockLab: Lab = {
    id: 1,
    ulid: 'lab-ulid-1',
    keyName: 'LAB001',
    name: 'Laboratorio de Sangre',
    description: 'Análisis sanguíneos'
  };

  const mockLabs: Lab[] = [
    mockLab,
    {
      id: 2,
      ulid: 'lab-ulid-2',
      keyName: 'LAB002',
      name: 'Laboratorio de Orina',
      description: 'Análisis de orina'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LabsService]
    });
    service = TestBed.inject(LabsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los laboratorios', () => {
    service.getAll().subscribe(labs => {
      expect(labs).toEqual(mockLabs);
      expect(labs.length).toBe(2);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockLabs);
  });

  it('debería obtener un laboratorio por ID', () => {
    const id = 1;

    service.getById(id).subscribe(lab => {
      expect(lab).toEqual(mockLab);
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLab);
  });

  it('debería obtener un laboratorio por ULID', () => {
    const ulid = 'lab-ulid-1';

    service.getByUlid(ulid).subscribe(lab => {
      expect(lab).toEqual(mockLab);
    });

    const req = httpMock.expectOne(`${apiUrl}/ulid/${ulid}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLab);
  });

  it('debería crear un nuevo laboratorio', () => {
    const keyName = 'LAB003';
    const name = 'Nuevo Laboratorio';
    const description = 'Descripción del nuevo lab';
    const newLab = { ...mockLab, id: 3, keyName, name, description };

    service.create(keyName, name, description).subscribe(lab => {
      expect(lab).toEqual(newLab);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ keyName, name, description });
    req.flush(newLab);
  });

  it('debería actualizar un laboratorio', () => {
    const ulid = 'lab-ulid-1';
    const keyName = 'LAB001_UPDATED';
    const name = 'Laboratorio Actualizado';
    const description = 'Descripción actualizada';
    const updatedLab = { ...mockLab, keyName, name, description };

    service.update(ulid, keyName, name, description).subscribe(lab => {
      expect(lab).toEqual(updatedLab);
    });

    const req = httpMock.expectOne(`${apiUrl}/${ulid}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ keyName, name, description });
    req.flush(updatedLab);
  });

  it('debería eliminar un laboratorio', () => {
    const id = 1;

    service.delete(id).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});