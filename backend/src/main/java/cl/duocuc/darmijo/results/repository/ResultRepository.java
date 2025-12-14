package cl.duocuc.darmijo.results.repository;

import cl.duocuc.darmijo.results.models.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    Optional<Result> findByUlid(String ulid);
    
    Optional<Result> findByNif(String nif);
}

