package ma.souqsignal.api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "estate_details")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "id_signal")
public class EstateDetails extends MarketSignal {
    private Double surfaceHabitable;
    private Integer chambres;
    private Integer etage;
    private String typeAppartement;
    private String secteur;
}