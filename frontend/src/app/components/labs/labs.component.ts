import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lab } from '../../models/lab';
import { LabsService } from '../../services/labs.service';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})
export class LabsComponent implements OnInit {
  labs: Lab[] = [];
  isLoading = false;
  error: string | null = null;
  
  // For the form modal
  isCreating = false;
  editingLab: Lab | null = null;
  formData = {
    keyName: '',
    name: '',
    description: ''
  };

  constructor(private labsService: LabsService) { }

  ngOnInit(): void {
    this.loadLabs();
  }

  loadLabs(): void {
    this.isLoading = true;
    this.error = null;
    
    this.labsService.getAll().subscribe({
      next: (labs) => {
        this.labs = labs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading labs:', error);
        this.error = 'Error al cargar los laboratorios';
        this.isLoading = false;
      }
    });
  }

  openCreateForm(): void {
    this.isCreating = true;
    this.editingLab = null;
    this.resetForm();
  }

  openEditForm(lab: Lab): void {
    this.isCreating = false;
    this.editingLab = lab;
    this.formData = {
      keyName: lab.keyName,
      name: lab.name,
      description: lab.description
    };
  }

  resetForm(): void {
    this.formData = {
      keyName: '',
      name: '',
      description: ''
    };
  }

  closeForm(): void {
    this.isCreating = false;
    this.editingLab = null;
    this.resetForm();
  }

  saveLab(): void {
    if (!this.formData.keyName || !this.formData.name || !this.formData.description) {
      return;
    }

    if (this.editingLab) {
      // Update existing lab
      this.labsService.update(
        this.editingLab.ulid,
        this.formData.keyName,
        this.formData.name,
        this.formData.description
      ).subscribe({
        next: () => {
          this.loadLabs();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error updating lab:', error);
          this.error = 'Error al actualizar el laboratorio';
        }
      });
    } else {
      // Create new lab
      this.labsService.create(
        this.formData.keyName,
        this.formData.name,
        this.formData.description
      ).subscribe({
        next: () => {
          this.loadLabs();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error creating lab:', error);
          this.error = 'Error al crear el laboratorio';
        }
      });
    }
  }

  deleteLab(lab: Lab): void {
    if (confirm(`¿Está seguro de que desea eliminar el laboratorio "${lab.name}"?`)) {
      this.labsService.delete(lab.id).subscribe({
        next: () => {
          this.loadLabs();
        },
        error: (error) => {
          console.error('Error deleting lab:', error);
          this.error = 'Error al eliminar el laboratorio';
        }
      });
    }
  }
}
