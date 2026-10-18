package ma.souqsignal.api.services;

import lombok.RequiredArgsConstructor;
import ma.souqsignal.api.entities.MotoDetails;
import ma.souqsignal.api.repositories.MotoDetailsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MotoMarketService {

    private final MotoDetailsRepository motoDetailsRepository;

    public Page<MotoDetails> searchMotos(
            String marque, String modele, Integer annee, int page, int size) {
        if (page < 0 || size < 1 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "page doit être >= 0 et size compris entre 1 et 100.");
        }

        PageRequest pageable = PageRequest.of(
                page, size, Sort.by(Sort.Direction.DESC, "idAnnoce"));
        return motoDetailsRepository.search(
                normalizeFilter(marque), normalizeFilter(modele), annee, pageable);
    }

    public MotoDetails getMotoById(Long id) {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "L'identifiant doit être positif.");
        }
        return motoDetailsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Annonce moto introuvable : " + id));
    }

    private String normalizeFilter(String value) {
        return value == null || value.isBlank() ? null : value.strip();
    }
}
