package ma.souqsignal.api.repositories;

import ma.souqsignal.api.entities.MarketInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarketInsightRepository extends JpaRepository<MarketInsight, Long> {

    // on cherche le plus récent pour une catégorie bien précise
    Optional<MarketInsight> findFirstByCategorieOrderByDateCreationDesc(String categorie);

    List<MarketInsight> findAllByOrderByDateCreationDesc();
}