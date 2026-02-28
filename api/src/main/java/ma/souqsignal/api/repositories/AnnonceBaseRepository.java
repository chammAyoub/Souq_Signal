package ma.souqsignal.api.repositories;

import ma.souqsignal.api.entities.AnnonceBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnonceBaseRepository extends JpaRepository<AnnonceBase, Long> {
    // spring boot gere le polymorphisme ici automatiquement
}