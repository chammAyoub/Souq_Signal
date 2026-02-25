package ma.souqsignal.api.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "market_signal")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
public abstract class MarketSignal {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long idSignal;
    private String titreAnnonce;
    private Double prix;
    private String ville;
    @CreationTimestamp
    private LocalDateTime dateAnnonce;
    @Column(length = 1000)
    private String imageURL;
}
