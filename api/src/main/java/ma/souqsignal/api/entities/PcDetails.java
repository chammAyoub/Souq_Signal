package ma.souqsignal.api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pc_details")
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "id_signal")
public class PcDetails extends MarketSignal {
    private String marque;
    private String processeur;
    private Integer ram;
    private Integer stockage;
    private String typeStockage;
}