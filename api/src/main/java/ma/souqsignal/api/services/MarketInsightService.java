package ma.souqsignal.api.services;

import lombok.RequiredArgsConstructor;
import ma.souqsignal.api.entities.MarketInsight;
import ma.souqsignal.api.repositories.MarketInsightRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketInsightService {

    private final MarketInsightRepository marketInsightRepository;

    // on retourne MarketInsight, pas AnnonceBase!
    public List<MarketInsight> getDerniersInsights() {
        List<MarketInsight> dashboardCards = new ArrayList<>();

        // 1. On cherche la dernière actualité "Auto" et on l'ajoute si elle existe
        marketInsightRepository.findFirstByCategorieOrderByDateCreationDesc("Auto")
                .ifPresent(dashboardCards::add);

        // 2. On cherche la dernière actualité "Immo"
        marketInsightRepository.findFirstByCategorieOrderByDateCreationDesc("Immo")
                .ifPresent(dashboardCards::add);

        // 3. On cherche la dernière actualité "Tech" (PC)
        marketInsightRepository.findFirstByCategorieOrderByDateCreationDesc("Tech")
                .ifPresent(dashboardCards::add);

        return dashboardCards;
    }

    // on sauvegarde MarketInsight, pas AnnonceBase!
    public MarketInsight saveNouvelInsight(MarketInsight insight) {
        return marketInsightRepository.save(insight);
    }
}