package ma.souqsignal.api.repositories;

import ma.souqsignal.api.entities.PcDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PcDetailsRepository extends JpaRepository<PcDetails, Long> {
}
