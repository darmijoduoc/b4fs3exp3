package cl.duocuc.darmijo.labs.service;

import cl.duocuc.darmijo.core.exceptions.ResourceNotFoundException;
import cl.duocuc.darmijo.labs.models.Lab;
import cl.duocuc.darmijo.labs.repository.LabRepository;
import com.github.f4b6a3.ulid.UlidCreator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LabService {
    
    private final LabRepository labRepository;
    
    public LabService(LabRepository labRepository) {
        this.labRepository = labRepository;
    }
    
    public Optional<Lab> createLab(String keyName, String name, String description) {
        String ulid = UlidCreator.getUlid().toString();
        Lab lab = new Lab();
        lab.setUlid(ulid);
        lab.setKeyName(keyName);
        lab.setName(name);
        lab.setDescription(description);
        labRepository.save(lab);
        return labRepository.findByUlid(ulid);
    }
    
    public Optional<Lab> updateLab(String ulid, String keyName, String name, String description) throws ResourceNotFoundException {
        Optional<Lab> optionalLab = labRepository.findByUlid(ulid);
        if(optionalLab.isEmpty()) {
            throw new ResourceNotFoundException("Lab not found");
        }
        Lab lab = optionalLab.get();
        lab.setKeyName(keyName);
        lab.setName(name);
        lab.setDescription(description);
        labRepository.save(lab);
        return getLabByUlid(lab.getUlid());
    }
    
    public List<Lab> getAllLabs() {
        return labRepository.findAll();
    }
    public Optional<Lab> getLabByUlid(String ulid) {
        return labRepository.findByUlid(ulid);
    }
    public Optional<Lab> getLabById(long id) {
        return labRepository.findById(id);
    }
    
    public Optional<Lab> getLabByKeyName(String keyName) {
        return labRepository.findByKeyName(keyName);
    }
    
    public void deleteLabById(long id) throws ResourceNotFoundException {
        Optional<Lab> lab = labRepository.findById(id);
        if (lab.isEmpty()) {
            throw new ResourceNotFoundException("Lab not found");
        }
        labRepository.delete(lab.get());
    }
}

