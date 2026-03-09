package ma.souqsignal.api.controllers;

import lombok.RequiredArgsConstructor;
import ma.souqsignal.api.entities.CarDetails;
import ma.souqsignal.api.services.CarMarketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cars")
@RequiredArgsConstructor
public class CarMarketController {
    private final CarMarketService carMarketService;

    @PostMapping("/sauvegarder")
    public ResponseEntity<List<CarDetails>> saveCarSignal(@RequestBody List<CarDetails> cardetails) {
        List<CarDetails> savedCarDetails = carMarketService.saveCarSignal(cardetails);
        return new ResponseEntity<>(savedCarDetails, HttpStatus.CREATED);
    }

    @GetMapping("/opportunites")
    public ResponseEntity<List<CarDetails>> getOpportunites(@RequestParam String marque, @RequestParam String modele, @RequestParam Integer annee){
        List<CarDetails> opportunites = carMarketService.getOpportunitesArbitrage(marque,modele,annee);
        if(!opportunites.isEmpty()){
            return new ResponseEntity<>(opportunites, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }
}
