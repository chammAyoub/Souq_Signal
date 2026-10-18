package ma.souqsignal.api.controllers;

import lombok.RequiredArgsConstructor;
import ma.souqsignal.api.entities.MotoDetails;
import ma.souqsignal.api.services.MotoMarketService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/motos")
@RequiredArgsConstructor
public class MotoMarketController {

    private final MotoMarketService motoMarketService;

    @GetMapping
    public Page<MotoDetails> getMotos(
            @RequestParam(name = "marque", required = false) String marque,
            @RequestParam(name = "modele", required = false) String modele,
            @RequestParam(name = "annee", required = false) Integer annee,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        return motoMarketService.searchMotos(marque, modele, annee, page, size);
    }

    @GetMapping("/{id}")
    public MotoDetails getMotoById(@PathVariable("id") Long id) {
        return motoMarketService.getMotoById(id);
    }
}
