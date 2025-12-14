import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ResultsComponent } from './results.component';
import { ResultsService } from '../../services/results.service';
import { LabsService } from '../../services/labs.service';
import { Result } from '../../models/result';
import { Lab } from '../../models/lab';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let resultsServiceSpy: jasmine.SpyObj<ResultsService>;
  let labsServiceSpy: jasmine.SpyObj<LabsService>;

  const mockLabs: Lab[] = [
    {
      id: 1,
      ulid: 'lab-ulid-1',
      keyName: 'LAB001',
      name: 'Laboratorio de Sangre',
      description: 'Análisis sanguíneos'
    },
    {
      id: 2,
      ulid: 'lab-ulid-2',
      keyName: 'LAB002',
      name: 'Laboratorio de Orina',
      description: 'Análisis de orina'
    }
  ];

  const mockResults: Result[] = [
    {
      id: 1,
      ulid: 'result-ulid-1',
      labId: 1,
      nif: '12345678A',
      patientName: 'Juan Pérez',
      date: 1703376000000, // Dec 23, 2023
      data: 'Glucosa: 90 mg/dl',
      status: 'Finalizado'
    },
    {
      id: 2,
      ulid: 'result-ulid-2',
      labId: 2,
      nif: '87654321B',
      patientName: 'María García',
      date: 1703462400000, // Dec 24, 2023
      data: 'Proteínas: Normal',
      status: 'Pendiente'
    }
  ];

  beforeEach(() => {
    const resultsSpy = jasmine.createSpyObj('ResultsService', ['getAllResults', 'createResult', 'updateResultStatus', 'deleteResult']);
    const labsSpy = jasmine.createSpyObj('LabsService', ['getAll']);

    TestBed.configureTestingModule({
      imports: [ResultsComponent],
      providers: [
        { provide: ResultsService, useValue: resultsSpy },
        { provide: LabsService, useValue: labsSpy }
      ]
    });

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    resultsServiceSpy = TestBed.inject(ResultsService) as jasmine.SpyObj<ResultsService>;
    labsServiceSpy = TestBed.inject(LabsService) as jasmine.SpyObj<LabsService>;

    // Configurar spies por defecto
    resultsServiceSpy.getAllResults.and.returnValue(of(mockResults));
    labsServiceSpy.getAll.and.returnValue(of(mockLabs));
    
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(console, 'error');
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con valores por defecto', () => {
    expect(component.results).toEqual([]);
    expect(component.labs).toEqual([]);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(10);
  });

  it('debería cargar resultados y laboratorios al inicializar', () => {
    component.ngOnInit();
    
    expect(resultsServiceSpy.getAllResults).toHaveBeenCalled();
    expect(labsServiceSpy.getAll).toHaveBeenCalled();
    expect(component.results).toEqual(mockResults);
    expect(component.labs).toEqual(mockLabs);
  });

  describe('loadResults', () => {
    it('debería cargar resultados exitosamente', () => {
      component.loadResults();
      
      expect(component.loading).toBe(false);
      expect(component.results).toEqual(mockResults);
      expect(component.error).toBeNull();
      expect(resultsServiceSpy.getAllResults).toHaveBeenCalled();
    });

    it('debería manejar errores al cargar resultados con error.error.message', () => {
      const error = { error: { message: 'Error de servidor' } };
      resultsServiceSpy.getAllResults.and.returnValue(throwError(() => error));
      
      component.loadResults();
      
      expect(component.error).toBe('Error al cargar los resultados: Error de servidor');
      expect(component.loading).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Error loading results:', error);
    });

    it('debería manejar errores al cargar resultados con error.message', () => {
      const error = { message: 'Error directo' };
      resultsServiceSpy.getAllResults.and.returnValue(throwError(() => error));
      
      component.loadResults();
      
      expect(component.error).toBe('Error al cargar los resultados: Error directo');
      expect(component.loading).toBe(false);
    });
  });

  describe('loadLabs', () => {
    it('debería cargar laboratorios exitosamente', () => {
      component.loadLabs();
      
      expect(component.labs).toEqual(mockLabs);
      expect(labsServiceSpy.getAll).toHaveBeenCalled();
    });

    it('debería manejar errores al cargar laboratorios', () => {
      const error = new Error('Error al cargar labs');
      labsServiceSpy.getAll.and.returnValue(throwError(() => error));
      
      component.loadLabs();
      
      expect(console.error).toHaveBeenCalledWith('Error loading labs:', error);
    });
  });

  describe('Paginación', () => {
    beforeEach(() => {
      // Crear más resultados para probar paginación
      const moreResults: Result[] = [];
      for (let i = 1; i <= 25; i++) {
        moreResults.push({
          id: i,
          ulid: `result-ulid-${i}`,
          labId: 1,
          nif: `12345678${i}`,
          patientName: `Paciente ${i}`,
          date: Date.now(),
          data: `Datos ${i}`,
          status: 'Pendiente'
        });
      }
      component.results = moreResults;
      component.itemsPerPage = 10;
    });

    it('debería calcular correctamente la paginación', () => {
      component.updatePagination();
      
      expect(component.totalPages).toBe(3);
      expect(component.currentPage).toBe(1);
    });

    it('debería obtener resultados paginados correctamente', () => {
      component.currentPage = 1;
      const paginatedResults = component.getPaginatedResults();
      
      expect(paginatedResults.length).toBe(10);
      expect(paginatedResults[0].id).toBe(1);
    });

    it('debería obtener resultados paginados para la página 2', () => {
      component.currentPage = 2;
      const paginatedResults = component.getPaginatedResults();
      
      expect(paginatedResults.length).toBe(10);
      expect(paginatedResults[0].id).toBe(11);
    });

    it('debería obtener resultados paginados para la última página', () => {
      component.updatePagination();
      component.currentPage = 3;
      const paginatedResults = component.getPaginatedResults();
      
      expect(paginatedResults.length).toBe(5);
      expect(paginatedResults[0].id).toBe(21);
    });

    it('debería cambiar página correctamente', () => {
      component.updatePagination();
      
      component.changePage(2);
      expect(component.currentPage).toBe(2);
      
      component.changePage(3);
      expect(component.currentPage).toBe(3);
    });

    it('no debería cambiar a página inválida (menor que 1)', () => {
      component.updatePagination();
      component.currentPage = 2;
      
      component.changePage(0);
      expect(component.currentPage).toBe(2);
    });

    it('no debería cambiar a página inválida (mayor que total)', () => {
      component.updatePagination();
      component.currentPage = 2;
      
      component.changePage(10);
      expect(component.currentPage).toBe(2);
    });
  });

  describe('deleteResult', () => {
    beforeEach(() => {
      component.results = [...mockResults];
    });

    it('debería eliminar resultado con confirmación', () => {
      resultsServiceSpy.deleteResult.and.returnValue(of(undefined));
      (window.confirm as jasmine.Spy).and.returnValue(true);
      
      component.deleteResult(1);
      
      expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que deseas eliminar este resultado?');
      expect(resultsServiceSpy.deleteResult).toHaveBeenCalledWith(1);
      expect(component.results.length).toBe(1);
      expect(window.alert).toHaveBeenCalledWith('Resultado eliminado exitosamente');
    });

    it('no debería eliminar resultado sin confirmación', () => {
      (window.confirm as jasmine.Spy).and.returnValue(false);
      
      component.deleteResult(1);
      
      expect(resultsServiceSpy.deleteResult).not.toHaveBeenCalled();
      expect(component.results.length).toBe(2);
    });

    it('debería manejar errores al eliminar resultado', () => {
      const error = { error: { message: 'Error al eliminar' } };
      resultsServiceSpy.deleteResult.and.returnValue(throwError(() => error));
      (window.confirm as jasmine.Spy).and.returnValue(true);
      
      component.deleteResult(1);
      
      expect(window.alert).toHaveBeenCalledWith('Error al eliminar el resultado: Error al eliminar');
      expect(console.error).toHaveBeenCalledWith('Error deleting result:', error);
    });
  });

  describe('updateResultStatus', () => {
    beforeEach(() => {
      component.results = [...mockResults];
    });

    it('debería actualizar estado del resultado exitosamente', () => {
      const updatedResult = { ...mockResults[0], status: 'Finalizado' };
      resultsServiceSpy.updateResultStatus.and.returnValue(of(updatedResult));
      
      component.updateResultStatus(1, 'Finalizado');
      
      expect(resultsServiceSpy.updateResultStatus).toHaveBeenCalledWith(1, 'Finalizado');
      expect(component.results[0].status).toBe('Finalizado');
      expect(window.alert).toHaveBeenCalledWith('Estado actualizado exitosamente');
    });

    it('debería manejar caso cuando resultado no se encuentra', () => {
      const updatedResult = { ...mockResults[0], id: 999, status: 'Finalizado' };
      resultsServiceSpy.updateResultStatus.and.returnValue(of(updatedResult));
      
      component.updateResultStatus(999, 'Finalizado');
      
      expect(window.alert).toHaveBeenCalledWith('Estado actualizado exitosamente');
    });

    it('debería manejar errores al actualizar estado', () => {
      const error = { error: { message: 'Error al actualizar' } };
      resultsServiceSpy.updateResultStatus.and.returnValue(throwError(() => error));
      
      component.updateResultStatus(1, 'Finalizado');
      
      expect(window.alert).toHaveBeenCalledWith('Error al actualizar el estado: Error al actualizar');
      expect(console.error).toHaveBeenCalledWith('Error updating status:', error);
    });
  });

  describe('Utilidades', () => {
    beforeEach(() => {
      component.labs = mockLabs;
    });

    it('debería obtener el nombre del laboratorio correctamente', () => {
      expect(component.getLabName(1)).toBe('Laboratorio de Sangre');
      expect(component.getLabName(2)).toBe('Laboratorio de Orina');
      expect(component.getLabName(999)).toBe('Laboratorio desconocido');
    });

    it('debería obtener el nombre clave del laboratorio correctamente', () => {
      expect(component.getLabKeyName(1)).toBe('LAB001');
      expect(component.getLabKeyName(2)).toBe('LAB002');
      expect(component.getLabKeyName(999)).toBe('Laboratorio desconocido');
    });

    it('debería formatear la fecha correctamente', () => {
      const timestamp = 1703376000000; // Dec 23, 2023
      const formattedDate = component.formatDate(timestamp);
      
      expect(formattedDate).toBe('23/12/2023');
    });

    it('debería retornar las clases CSS correctas para todos los estados', () => {
      expect(component.getStatusBadgeClass('Finalizado')).toBe('bg-success');
      expect(component.getStatusBadgeClass('finalizado')).toBe('bg-success');
      expect(component.getStatusBadgeClass('Pendiente')).toBe('bg-warning text-dark');
      expect(component.getStatusBadgeClass('pendiente')).toBe('bg-warning text-dark');
      expect(component.getStatusBadgeClass('Crítico')).toBe('bg-danger');
      expect(component.getStatusBadgeClass('crítico')).toBe('bg-danger');
      expect(component.getStatusBadgeClass('critico')).toBe('bg-danger');
      expect(component.getStatusBadgeClass('En Proceso')).toBe('bg-info text-dark');
      expect(component.getStatusBadgeClass('en proceso')).toBe('bg-info text-dark');
      expect(component.getStatusBadgeClass('Estado Desconocido')).toBe('bg-secondary');
    });

    it('debería retornar opciones de estado correctas', () => {
      const statusOptions = component.getStatusOptions();
      expect(statusOptions).toEqual(['Pendiente', 'En Proceso', 'Finalizado', 'Crítico']);
    });

    it('debería rastrear resultados por ID correctamente', () => {
      const result = mockResults[0];
      expect(component.trackByResultId(0, result)).toBe(1);
    });
  });

  describe('Modales', () => {
    let mockModalElement: any;
    let mockModal: any;

    beforeEach(() => {
      mockModal = {
        show: jasmine.createSpy('show'),
        hide: jasmine.createSpy('hide')
      };
      mockModalElement = document.createElement('div');
      
      spyOn(document, 'getElementById').and.returnValue(mockModalElement);
      
      // Mock Bootstrap
      (window as any).bootstrap = {
        Modal: jasmine.createSpy('Modal').and.returnValue(mockModal)
      };
      (window as any).bootstrap.Modal.getInstance = jasmine.createSpy('getInstance').and.returnValue(mockModal);
    });

    it('debería mostrar modal de detalle de resultado', () => {
      const result = mockResults[0];
      
      component.showResultDetail(result);
      
      expect(component.selectedResult).toBe(result);
      expect(document.getElementById).toHaveBeenCalledWith('resultDetailModal');
      expect((window as any).bootstrap.Modal).toHaveBeenCalledWith(mockModalElement);
      expect(mockModal.show).toHaveBeenCalled();
    });

    it('debería manejar caso cuando modal de detalle no existe', () => {
      (document.getElementById as jasmine.Spy).and.returnValue(null);
      
      component.showResultDetail(mockResults[0]);
      
      expect(component.selectedResult).toBe(mockResults[0]);
      expect((window as any).bootstrap.Modal).not.toHaveBeenCalled();
    });

    it('debería mostrar modal de crear resultado', () => {
      component.showCreateResultModal();
      
      expect(component.newResult).toEqual({
        labId: '',
        nif: '',
        patientName: '',
        data: '',
        status: 'Pendiente'
      });
      expect(document.getElementById).toHaveBeenCalledWith('createResultModal');
      expect((window as any).bootstrap.Modal).toHaveBeenCalledWith(mockModalElement);
      expect(mockModal.show).toHaveBeenCalled();
    });

    it('debería manejar caso cuando modal de crear no existe', () => {
      (document.getElementById as jasmine.Spy).and.returnValue(null);
      
      component.showCreateResultModal();
      
      expect(component.newResult.status).toBe('Pendiente');
      expect((window as any).bootstrap.Modal).not.toHaveBeenCalled();
    });
  });

  describe('Crear resultado', () => {
    let mockModalElement: any;
    let mockModal: any;

    beforeEach(() => {
      mockModal = {
        hide: jasmine.createSpy('hide')
      };
      mockModalElement = document.createElement('div');
      
      spyOn(document, 'getElementById').and.returnValue(mockModalElement);
      
      (window as any).bootstrap = {
        Modal: {
          getInstance: jasmine.createSpy('getInstance').and.returnValue(mockModal)
        }
      };

      component.newResult = {
        labId: '1',
        nif: '12345678A',
        patientName: 'Test Patient',
        data: 'Test Data',
        status: 'Pendiente'
      };
    });

    it('debería crear resultado exitosamente', () => {
      const createdResult = { ...mockResults[0], id: 3 };
      resultsServiceSpy.createResult.and.returnValue(of(createdResult));
      component.results = [...mockResults];
      
      component.createResult();
      
      expect(resultsServiceSpy.createResult).toHaveBeenCalledWith({
        labId: 1,
        nif: '12345678A',
        patientName: 'Test Patient',
        data: 'Test Data',
        status: 'Pendiente',
        date: jasmine.any(Number)
      });
      expect(component.results[0]).toBe(createdResult);
      expect(component.isCreatingResult).toBe(false);
      expect(window.alert).toHaveBeenCalledWith('Resultado creado exitosamente');
    });

    it('debería validar campos requeridos - labId vacío', () => {
      component.newResult.labId = '';
      
      component.createResult();
      
      expect(window.alert).toHaveBeenCalledWith('Por favor, complete todos los campos requeridos.');
      expect(resultsServiceSpy.createResult).not.toHaveBeenCalled();
    });

    it('debería validar campos requeridos - nif vacío', () => {
      component.newResult.nif = '';
      
      component.createResult();
      
      expect(window.alert).toHaveBeenCalledWith('Por favor, complete todos los campos requeridos.');
      expect(resultsServiceSpy.createResult).not.toHaveBeenCalled();
    });

    it('debería validar campos requeridos - patientName vacío', () => {
      component.newResult.patientName = '';
      
      component.createResult();
      
      expect(window.alert).toHaveBeenCalledWith('Por favor, complete todos los campos requeridos.');
      expect(resultsServiceSpy.createResult).not.toHaveBeenCalled();
    });

    it('debería validar campos requeridos - data vacío', () => {
      component.newResult.data = '';
      
      component.createResult();
      
      expect(window.alert).toHaveBeenCalledWith('Por favor, complete todos los campos requeridos.');
      expect(resultsServiceSpy.createResult).not.toHaveBeenCalled();
    });

    it('debería limpiar espacios en blanco de los campos', () => {
      component.newResult = {
        labId: '1',
        nif: '  12345678A  ',
        patientName: '  Test Patient  ',
        data: '  Test Data  ',
        status: 'Pendiente'
      };
      
      const createdResult = { ...mockResults[0], id: 3 };
      resultsServiceSpy.createResult.and.returnValue(of(createdResult));
      
      component.createResult();
      
      expect(resultsServiceSpy.createResult).toHaveBeenCalledWith({
        labId: 1,
        nif: '12345678A',
        patientName: 'Test Patient',
        data: 'Test Data',
        status: 'Pendiente',
        date: jasmine.any(Number)
      });
    });

    it('debería cerrar modal después de crear resultado exitosamente', () => {
      const createdResult = { ...mockResults[0], id: 3 };
      resultsServiceSpy.createResult.and.returnValue(of(createdResult));
      
      component.createResult();
      
      expect(document.getElementById).toHaveBeenCalledWith('createResultModal');
      expect((window as any).bootstrap.Modal.getInstance).toHaveBeenCalledWith(mockModalElement);
      expect(mockModal.hide).toHaveBeenCalled();
    });

    it('debería manejar caso cuando modal no existe', () => {
      (document.getElementById as jasmine.Spy).and.returnValue(null);
      const createdResult = { ...mockResults[0], id: 3 };
      resultsServiceSpy.createResult.and.returnValue(of(createdResult));
      
      component.createResult();
      
      expect(window.alert).toHaveBeenCalledWith('Resultado creado exitosamente');
    });

    it('debería manejar caso cuando no hay instancia de modal', () => {
      ((window as any).bootstrap.Modal.getInstance as jasmine.Spy).and.returnValue(null);
      const createdResult = { ...mockResults[0], id: 3 };
      resultsServiceSpy.createResult.and.returnValue(of(createdResult));
      
      component.createResult();
      
      expect(window.alert).toHaveBeenCalledWith('Resultado creado exitosamente');
    });

    it('debería manejar errores al crear resultado', () => {
      const error = { error: { message: 'Error al crear' } };
      resultsServiceSpy.createResult.and.returnValue(throwError(() => error));
      
      component.createResult();
      
      expect(component.isCreatingResult).toBe(false);
      expect(window.alert).toHaveBeenCalledWith('Error al crear el resultado: Error al crear');
      expect(console.error).toHaveBeenCalledWith('Error creating result:', error);
    });

    it('debería manejar errores al crear resultado con error.message', () => {
      const error = { message: 'Error directo' };
      resultsServiceSpy.createResult.and.returnValue(throwError(() => error));
      
      component.createResult();
      
      expect(window.alert).toHaveBeenCalledWith('Error al crear el resultado: Error directo');
    });
  });
});
