package ma.souqsignal.api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "market_insights")
@Getter
@Setter
@NoArgsConstructor
public class MarketInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String pourcentage;
    private String titreRapide;
    private String description;
    private String categorie;

    @CreationTimestamp
    private LocalDateTime dateCreation;
}