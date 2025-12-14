package cl.duocuc.darmijo.labs.models;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateLabParams {
    @NotBlank(message = "El keyName no puede estar vacío")
    @Size(min = 2, max = 50, message = "El keyName debe tener entre 2 y 50 caracteres")
    private String keyName;
    
    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String name;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String description;
    
    public CreateLabParams() {
    }
    
    public CreateLabParams(String keyName, String name, String description) {
        this.keyName = keyName;
        this.name = name;
        this.description = description;
    }
}

