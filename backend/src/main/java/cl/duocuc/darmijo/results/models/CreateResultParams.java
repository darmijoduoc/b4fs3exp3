package cl.duocuc.darmijo.results.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateResultParams {
    @NotBlank(message = "El labId no puede estar vacío")
    private int labId;
    
    @NotBlank(message = "El NIF no puede estar vacío")
    @Size(min = 2, max = 50, message = "El NIF debe tener entre 2 y 50 caracteres")
    private String nif;
    
    @NotBlank(message = "El nombre del paciente no puede estar vacío")
    @Size(min = 3, max = 100, message = "El nombre del paciente debe tener entre 3 y 100 caracteres")
    private String patientName;
    
    @NotNull(message = "La fecha no puede estar vacía")
    private Long date;
    
    @NotBlank(message = "Los datos no pueden estar vacíos")
    private String data;
    
    @NotBlank(message = "El estado no puede estar vacío")
    private String status;
    
    public CreateResultParams() {
    }
    
    public CreateResultParams(int labId, String nif, String patientName, Long date, String data, String status) {
        this.labId = labId;
        this.nif = nif;
        this.patientName = patientName;
        this.date = date;
        this.data = data;
        this.status = status;
    }
}

