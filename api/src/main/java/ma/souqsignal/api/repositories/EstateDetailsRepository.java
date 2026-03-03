package ma.souqsignal.api.repositories;

import ma.souqsignal.api.entities.EstateDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EstateDetailsRepository extends JpaRepository<EstateDetails, Long> {

    @Query("SELECT AVG(e.prix) FROM EstateDetails e WHERE e.ville = :ville AND e.secteur = :secteur AND e.dateAnnonce >= :startDate")
    Double getAverageRentSince(@Param("ville") String ville,
                               @Param("secteur") String secteur,
                               @Param("startDate") LocalDateTime startDate);
}