import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Result } from '../../models/result';
import { Lab } from '../../models/lab';
import { ResultsService } from '../../services/results.service';
import { LabsService } from '../../services/labs.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  results: Result[] = [];
  labs: Lab[] = [];
  loading = false;
  error: string | null = null;
  selectedResult: Result | null = null;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Formulario para crear resultado
  newResult = {
    labId: '',
    nif: '',
    patientName: '',
    data: '',
    status: 'Pendiente'
  };
  isCreatingResult = false;

  constructor(
    private resultsService: ResultsService,
    private labsService: LabsService
  ) {}

  ngOnInit(): void {
    this.loadResults();
    this.loadLabs();
  }

  loadResults(): void {
    this.loading = true;
    this.error = null;

    this.resultsService.getAllResults().subscribe({
      next: (results: Result[]) => {
        this.results = results;
        this.updatePagination();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar los resultados: ' + (error.error?.message || error.message);
        this.loading = false;
        console.error('Error loading results:', error);
      }
    });
  }

  loadLabs(): void {
    this.labsService.getAll().subscribe({
      next: (labs: Lab[]) => {
        this.labs = labs;
      },
      error: (error: any) => {
        console.error('Error loading labs:', error);
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.results.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedResults(): Result[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.results.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  deleteResult(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este resultado?')) {
      this.resultsService.deleteResult(id).subscribe({
        next: () => {
          this.results = this.results.filter(result => result.id !== id);
          this.updatePagination();
          alert('Resultado eliminado exitosamente');
        },
        error: (error) => {
          alert('Error al eliminar el resultado: ' + (error.error?.message || error.message));
          console.error('Error deleting result:', error);
        }
      });
    }
  }

  updateResultStatus(id: number, newStatus: string): void {
    this.resultsService.updateResultStatus(id, newStatus).subscribe({
      next: (updatedResult) => {
        const index = this.results.findIndex(result => result.id === id);
        if (index !== -1) {
          this.results[index] = updatedResult;
        }
        alert('Estado actualizado exitosamente');
      },
      error: (error) => {
        alert('Error al actualizar el estado: ' + (error.error?.message || error.message));
        console.error('Error updating status:', error);
      }
    });
  }

  getLabName(labId: number): string {
    const lab = this.labs.find(l => l.id === labId);
    return lab ? lab.name : 'Laboratorio desconocido';
  }

  getLabKeyName(labId: number): string {
    const lab = this.labs.find(l => l.id === labId);
    return lab ? lab.keyName : 'Laboratorio desconocido';
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('es-ES');
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'finalizado':
        return 'bg-success';
      case 'pendiente':
        return 'bg-warning text-dark';
      case 'crítico':
      case 'critico':
        return 'bg-danger';
      case 'en proceso':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  }

  getStatusOptions(): string[] {
    return ['Pendiente', 'En Proceso', 'Finalizado', 'Crítico'];
  }

  trackByResultId(index: number, result: Result): number {
    return result.id;
  }

  showResultDetail(result: Result): void {
    this.selectedResult = result;
    const modalElement = document.getElementById('resultDetailModal');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  showCreateResultModal(): void {
    // Resetear formulario
    this.newResult = {
      labId: '',
      nif: '',
      patientName: '',
      data: '',
      status: 'Pendiente'
    };
    
    const modalElement = document.getElementById('createResultModal');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  createResult(): void {
    if (!this.newResult.labId || !this.newResult.nif || !this.newResult.patientName || !this.newResult.data) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.isCreatingResult = true;

    const resultData = {
      labId: parseInt(this.newResult.labId),
      nif: this.newResult.nif.trim(),
      patientName: this.newResult.patientName.trim(),
      data: this.newResult.data.trim(),
      status: this.newResult.status,
      date: Date.now() // Agregar timestamp actual
    };

    this.resultsService.createResult(resultData).subscribe({
      next: (createdResult: Result) => {
        this.results.unshift(createdResult);
        this.updatePagination();
        this.isCreatingResult = false;
        
        // Cerrar modal
        const modalElement = document.getElementById('createResultModal');
        if (modalElement) {
          const bootstrap = (window as any).bootstrap;
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
        
        alert('Resultado creado exitosamente');
      },
      error: (error) => {
        this.isCreatingResult = false;
        alert('Error al crear el resultado: ' + (error.error?.message || error.message));
        console.error('Error creating result:', error);
      }
    });
  }
}
