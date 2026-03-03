package ma.souqsignal.api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "car_details")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "id_annonce")
public class CarDetails extends AnnonceBase {
    private String marque;
    private String modele;
    private Integer anneeModele;
    private Long kilometrage;
    private String carburant;
    private String boiteVitesse;
}