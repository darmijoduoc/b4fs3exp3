package cl.duocuc.darmijo.results.models;

import com.github.f4b6a3.ulid.Ulid;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "exp2_result")
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String ulid;
    private int labId;
    private String nif;
    private String patientName;
    @Column(name = "result_date")
    private long date;
    
    private String data;
    private String status;
    
    public long createdAt() {
        return Ulid.from(ulid).getTime();
    }
    
    
}
