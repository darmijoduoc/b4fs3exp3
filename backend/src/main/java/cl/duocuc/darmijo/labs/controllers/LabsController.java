package cl.duocuc.darmijo.labs.controllers;

import cl.duocuc.darmijo.core.exceptions.ResourceNotFoundException;
import cl.duocuc.darmijo.labs.models.CreateLabParams;
import cl.duocuc.darmijo.labs.models.Lab;
import cl.duocuc.darmijo.labs.models.UpdateLabParams;
import cl.duocuc.darmijo.labs.service.LabService;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/labs")
public class LabsController {
    private final LabService labService;
    
    public LabsController(LabService labService) {
        this.labService = labService;
    }
    
    @PostConstruct
    public void init() {
        List.of(
            new CreateLabParams("LAB-CLI-01", "Laboratorio Clínico General", "Laboratorio para análisis clínicos generales"),
            new CreateLabParams("LAB-HEM-01", "Laboratorio de Hematología", "Especializado en análisis de sangre y hemograma completo"),
            new CreateLabParams("LAB-MB-01", "Laboratorio de Microbiología", "Análisis de cultivos, identificación de patógenos y antibiograma"),
            new CreateLabParams("LAB-BQ-01", "Laboratorio de Bioquímica Clínica", "Pruebas bioquímicas y marcadores metabólicos"),
            new CreateLabParams("LAB-IL-01", "Laboratorio de Inmunología", "Pruebas serológicas y perfiles inmunológicos")
        ).forEach(this::postLab);
    }
    
    @PostMapping
    public ResponseEntity<?> postLab(@RequestBody  CreateLabParams params) {
        Optional<Lab> lab = labService.createLab(
            params.getKeyName(),
            params.getName(),
            params.getDescription()
        );
        return ResponseEntity.ok(lab);
    }
    
    @GetMapping
    public ResponseEntity<?> getLabs() {
        List<Lab> labs = labService.getAllLabs();
        return ResponseEntity.ok(labs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getLab(@PathVariable long id) {
        Optional<Lab> lab = labService.getLabById(id);
        return ResponseEntity.ok(lab);
    }
    
    @GetMapping("/key/{keyName}")
    public ResponseEntity<?> getLabByKeyName(@PathVariable String keyName) {
        Optional<Lab> lab = labService.getLabByKeyName(keyName);
        return ResponseEntity.ok(lab);
    }
    
    @PatchMapping("/{ulid}")
    public ResponseEntity<?> updateLab(
        @PathVariable String ulid,
        @RequestBody UpdateLabParams params
    ) throws ResourceNotFoundException {
        Optional<Lab> lab = labService.updateLab(
            ulid,
            params.getKeyName(),
            params.getName(),
            params.getDescription()
        );
        return ResponseEntity.ok(lab);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLab(@PathVariable long id) throws ResourceNotFoundException {
        labService.deleteLabById(id);
        return ResponseEntity.ok().build();
    }
}

