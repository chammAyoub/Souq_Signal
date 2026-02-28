package ma.souqsignal.api.repositories;

import ma.souqsignal.api.entities.CarDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarDetailsRepository extends JpaRepository<CarDetails, Long> {

    // JPQL k-y-khdem b smyat lClasses (CarDetails) machi tables
    @Query("SELECT AVG(c.prix) FROM CarDetails c WHERE c.marque = :marque AND c.modele = :modele AND c.anneeModele = :annee")
    Double findAveragePriceByCar(@Param("marque") String marque,
                                 @Param("modele") String modele,
                                 @Param("annee") Integer annee);


    List<CarDetails> findByMarqueAndModeleAndPriceLessThan(String marque, String modele, Double prixMax);
}