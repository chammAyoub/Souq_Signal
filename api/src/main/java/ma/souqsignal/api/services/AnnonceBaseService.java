package ma.souqsignal.api.services;

import lombok.RequiredArgsConstructor;
import ma.souqsignal.api.entities.AnnonceBase;
import ma.souqsignal.api.repositories.AnnonceBaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnonceBaseService {

    private final AnnonceBaseRepository annonceBaseRepository;

    // Récupère toutes les annonces brutes confondues (Auto, Immo, PC)
    public List<AnnonceBase> getToutesLesAnnonces() {
        return annonceBaseRepository.findAll();
    }

    // Compte le nombre total des annonces scrappées (pour l'Admin)
    public long compterToutesLesAnnonces() {
        return annonceBaseRepository.count();
    }

    // Supprime n'importe quelle annonce (Auto, Immo ou PC) par son ID
    public void supprimerAnnonce(Long id) {
        annonceBaseRepository.deleteById(id);
    }
}