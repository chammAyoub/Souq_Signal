package ma.souqsignal.api.repositories;

import ma.souqsignal.api.entities.MarketSignal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketSignalRepository extends JpaRepository<MarketSignal, Long> {

}
