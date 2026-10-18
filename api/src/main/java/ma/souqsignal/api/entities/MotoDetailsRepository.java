package ma.souqsignal.api.repositories;

import ma.souqsignal.api.entities.MotoDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MotoDetailsRepository extends JpaRepository<MotoDetails, Long> {

    @Query("""
            SELECT m FROM MotoDetails m
            WHERE (:marque IS NULL OR LOWER(m.marque) = LOWER(:marque))
              AND (:modele IS NULL OR LOWER(m.modele) = LOWER(:modele))
              AND (:annee IS NULL OR m.anneeModele = :annee)
            """)
    Page<MotoDetails> search(
            @Param("marque") String marque,
            @Param("modele") String modele,
            @Param("annee") Integer annee,
            Pageable pageable);
}
