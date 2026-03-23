package ma.souqsignal.api.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "annonce_base")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
public abstract class AnnonceBase {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long idAnnoce;
    private String titreAnnonce;
    private Double prix;
    private String ville;
    @CreationTimestamp
    private LocalDateTime dateAnnonce;
    @Column(length = 1000)
    private String imageURL;
    @Column(unique = true, length = 1000)
    private String urlAnnonce;
}
