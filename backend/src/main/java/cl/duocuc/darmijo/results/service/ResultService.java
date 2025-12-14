package cl.duocuc.darmijo.results.service;

import cl.duocuc.darmijo.core.exceptions.ResourceNotFoundException;
import cl.duocuc.darmijo.results.models.Result;
import cl.duocuc.darmijo.results.repository.ResultRepository;
import com.github.f4b6a3.ulid.UlidCreator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResultService {
    
    private final ResultRepository resultRepository;
    
    public ResultService(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }
    
    public Optional<Result> createResult(int labId, String nif, String patientName, Long date, String data, String status) {
        String ulid = UlidCreator.getUlid().toString();
        Result result = new Result();
        result.setUlid(ulid);
        result.setLabId(labId);
        result.setNif(nif);
        result.setPatientName(patientName);
        result.setDate(date);
        result.setData(data);
        result.setStatus(status);
        resultRepository.save(result);
        return resultRepository.findByUlid(ulid);
    }
    
    public Optional<Result> updateResult(String ulid, int labId, String nif, String patientName, Long date, String data, String status) throws ResourceNotFoundException {
        Optional<Result> optionalResult = resultRepository.findByUlid(ulid);
        if(optionalResult.isEmpty()) {
            throw new ResourceNotFoundException("Result not found");
        }
        Result result = optionalResult.get();
        result.setLabId(labId);
        result.setNif(nif);
        result.setPatientName(patientName);
        result.setDate(date);
        result.setData(data);
        result.setStatus(status);
        resultRepository.save(result);
        return getResultByUlid(result.getUlid());
    }
    
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }
    
    public Optional<Result> getResultByUlid(String ulid) {
        return resultRepository.findByUlid(ulid);
    }
    
    public Optional<Result> getResultById(long id) {
        return resultRepository.findById(id);
    }
    
    public Optional<Result> getResultByNif(String nif) {
        return resultRepository.findByNif(nif);
    }
    
    public void deleteResultById(long id) throws ResourceNotFoundException {
        Optional<Result> result = resultRepository.findById(id);
        if (result.isEmpty()) {
            throw new ResourceNotFoundException("Result not found");
        }
        resultRepository.delete(result.get());
    }
}

