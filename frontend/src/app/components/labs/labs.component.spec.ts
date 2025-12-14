import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LabsComponent } from './labs.component';
import { LabsService } from '../../services/labs.service';
import { Lab } from '../../models/lab';

describe('LabsComponent', () => {
  let component: LabsComponent;
  let fixture: ComponentFixture<LabsComponent>;
  let labsServiceSpy: jasmine.SpyObj<LabsService>;

  const mockLabs: Lab[] = [
    {
      id: 1,
      ulid: 'lab-ulid-1',
      keyName: 'LAB001',
      name: 'Laboratorio de Química',
      description: 'Laboratorio para experimentos químicos'
    },
    {
      id: 2,
      ulid: 'lab-ulid-2', 
      keyName: 'LAB002',
      name: 'Laboratorio de Física',
      description: 'Laboratorio para experimentos físicos'
    }
  ];

  beforeEach(() => {
    const labsSpy = jasmine.createSpyObj('LabsService', ['getAll', 'create', 'update', 'delete']);

    TestBed.configureTestingModule({
      imports: [LabsComponent],
      providers: [
        { provide: LabsService, useValue: labsSpy }
      ]
    });

    fixture = TestBed.createComponent(LabsComponent);
    component = fixture.componentInstance;
    labsServiceSpy = TestBed.inject(LabsService) as jasmine.SpyObj<LabsService>;

    // Configurar spies por defecto
    labsServiceSpy.getAll.and.returnValue(of(mockLabs));
    
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'error');
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con valores por defecto', () => {
    expect(component.labs).toEqual([]);
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
    expect(component.isCreating).toBe(false);
    expect(component.editingLab).toBeNull();
  });

  it('debería cargar laboratorios al inicializar', () => {
    component.ngOnInit();
    
    expect(labsServiceSpy.getAll).toHaveBeenCalled();
    expect(component.labs).toEqual(mockLabs);
    expect(component.isLoading).toBe(false);
  });

  it('debería manejar errores al cargar laboratorios', () => {
    const error = { message: 'Error de red' };
    labsServiceSpy.getAll.and.returnValue(throwError(() => error));
    
    component.loadLabs();
    
    expect(component.error).toBe('Error al cargar los laboratorios');
    expect(component.isLoading).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Error loading labs:', error);
  });

  it('debería abrir formulario de creación', () => {
    component.openCreateForm();
    
    expect(component.isCreating).toBe(true);
    expect(component.editingLab).toBeNull();
    expect(component.formData.keyName).toBe('');
    expect(component.formData.name).toBe('');
    expect(component.formData.description).toBe('');
  });

  it('debería abrir formulario de edición con datos del laboratorio', () => {
    const labToEdit = mockLabs[0];
    
    component.openEditForm(labToEdit);
    
    expect(component.isCreating).toBe(false);
    expect(component.editingLab).toEqual(labToEdit);
    expect(component.formData.keyName).toBe(labToEdit.keyName);
    expect(component.formData.name).toBe(labToEdit.name);
    expect(component.formData.description).toBe(labToEdit.description);
  });

  it('debería crear nuevo laboratorio con datos válidos', () => {
    labsServiceSpy.create.and.returnValue(of(mockLabs[0]));
    
    component.formData = {
      keyName: 'LAB003',
      name: 'Nuevo Lab',
      description: 'Descripción del nuevo lab'
    };
    
    component.saveLab();
    
    expect(labsServiceSpy.create).toHaveBeenCalledWith('LAB003', 'Nuevo Lab', 'Descripción del nuevo lab');
    expect(labsServiceSpy.getAll).toHaveBeenCalled();
  });

  it('debería actualizar laboratorio existente', () => {
    labsServiceSpy.update.and.returnValue(of(mockLabs[0]));
    
    component.editingLab = mockLabs[0];
    component.formData = {
      keyName: 'LAB001-UPDATED',
      name: 'Lab Actualizado',
      description: 'Descripción actualizada'
    };
    
    component.saveLab();
    
    expect(labsServiceSpy.update).toHaveBeenCalledWith(
      mockLabs[0].ulid,
      'LAB001-UPDATED', 
      'Lab Actualizado',
      'Descripción actualizada'
    );
  });

  it('debería eliminar laboratorio con confirmación', () => {
    labsServiceSpy.delete.and.returnValue(of(undefined));
    const labToDelete = mockLabs[0];
    
    component.deleteLab(labToDelete);
    
    expect(window.confirm).toHaveBeenCalledWith('¿Está seguro de que desea eliminar el laboratorio "Laboratorio de Química"?');
    expect(labsServiceSpy.delete).toHaveBeenCalledWith(labToDelete.id);
  });
});
