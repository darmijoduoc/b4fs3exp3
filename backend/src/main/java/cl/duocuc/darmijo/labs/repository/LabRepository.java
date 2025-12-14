package cl.duocuc.darmijo.labs.repository;

import cl.duocuc.darmijo.labs.models.Lab;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LabRepository extends JpaRepository<Lab, Long> {
    Optional<Lab> findByUlid(String ulid);
    
    Optional<Lab> findByKeyName(String keyName);
}

