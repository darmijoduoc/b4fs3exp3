package cl.duocuc.darmijo.labs.models;

import com.github.f4b6a3.ulid.Ulid;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "exp2_lab")
public class Lab {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String ulid;
    
    @Column(unique = true)
    private String keyName;
    
    private String name;
    private String description;
    
    public long createdAt() {
        return Ulid.from(ulid).getTime();
    }
}
