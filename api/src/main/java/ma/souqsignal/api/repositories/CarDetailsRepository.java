package ma.souqsignal.api.repositories;

import ma.souqsignal.api.entities.CarDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarDetailsRepository extends JpaRepository<CarDetails, Long> {

    // prix moyenne par marque, modele, annee
    @Query("SELECT AVG(c.prix) FROM CarDetails c WHERE c.marque = :marque AND c.modele = :modele AND c.anneeModele = :annee")
    Double findAveragePriceByCar(@Param("marque") String marque,
                                 @Param("modele") String modele,
                                 @Param("annee") Integer annee);



    List<CarDetails> findByMarqueAndModeleAndPrixLessThan(String marque, String modele, Double prixMax);

    boolean existsByUrlAnnonce(String urlAnnonce);
}