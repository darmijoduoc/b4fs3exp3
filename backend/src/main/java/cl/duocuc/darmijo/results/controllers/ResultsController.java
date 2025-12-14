package cl.duocuc.darmijo.results.controllers;

import cl.duocuc.darmijo.core.exceptions.ResourceNotFoundException;
import cl.duocuc.darmijo.results.models.CreateResultParams;
import cl.duocuc.darmijo.results.models.Result;
import cl.duocuc.darmijo.results.models.UpdateResultParams;
import cl.duocuc.darmijo.results.service.ResultService;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/results")
public class ResultsController {
    private final ResultService resultService;
    
    public ResultsController(ResultService resultService) {
        this.resultService = resultService;
    }
    
    @PostConstruct
    public void init() {
        for (int labId = 1; labId <= 5; labId++) {
            String[] statuses = {"completed", "pending", "in_progress"};
            for (int i = 1; i <= 5; i++) {
                String nif = String.format("%08d-%d", labId * 100 + i, (labId + i) % 10);
                String patientName = "Paciente " + labId + "-" + i;
                long date = System.currentTimeMillis();
                String data = "Resultado " + i + " for lab " + labId;
                String status = statuses[(i - 1) % statuses.length];
                this.postResult(new CreateResultParams(labId, nif, patientName, date, data, status));
            }
        }
    }
    
    @PostMapping
    public ResponseEntity<?> postResult(@RequestBody CreateResultParams params) {
        Optional<Result> result = resultService.createResult(
            params.getLabId(),
            params.getNif(),
            params.getPatientName(),
            params.getDate(),
            params.getData(),
            params.getStatus()
        );
        return ResponseEntity.ok(result);
    }
    
    @GetMapping
    public ResponseEntity<?> getResults() {
        List<Result> results = resultService.getAllResults();
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getResult(@PathVariable long id) {
        Optional<Result> result = resultService.getResultById(id);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/nif/{nif}")
    public ResponseEntity<?> getResultByNif(@PathVariable String nif) {
        Optional<Result> result = resultService.getResultByNif(nif);
        return ResponseEntity.ok(result);
    }
    
    @PatchMapping("/{ulid}")
    public ResponseEntity<?> updateResult(
        @PathVariable String ulid,
        @RequestBody UpdateResultParams params
    ) throws ResourceNotFoundException {
        Optional<Result> result = resultService.updateResult(
            ulid,
            params.getLabId(),
            params.getNif(),
            params.getPatientName(),
            params.getDate(),
            params.getData(),
            params.getStatus()
        );
        return ResponseEntity.ok(result);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResult(@PathVariable long id) throws ResourceNotFoundException {
        resultService.deleteResultById(id);
        return ResponseEntity.ok().build();
    }
}

