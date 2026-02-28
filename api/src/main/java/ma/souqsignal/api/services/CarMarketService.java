package ma.souqsignal.api.services;

import lombok.RequiredArgsConstructor;
import ma.souqsignal.api.entities.CarDetails;
import ma.souqsignal.api.repositories.CarDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarMarketService {
    private final CarDetailsRepository carDetailsRepository;

    public CarDetails saveCarSignal(CarDetails carDetails){
        return carDetailsRepository.save(carDetails);
    }

    public void deleteCarSignal(Long id){
        carDetailsRepository.deleteById(id);
    }

    public List<CarDetails> getAllCarDetails(){
        return carDetailsRepository.findAll();
    }

    public CarDetails getCarDetailsById(Long id){
        return carDetailsRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Car with ID \" + id + \" not found in the market data."));
    }

    public Double getCarMarketValue(String marque, String modele, Integer annee){
        Double MarketValue = carDetailsRepository.findAveragePriceByCar(marque, modele, annee);

        if(MarketValue == null){
            return 0.0;
        }
        return MarketValue;
    }

    // Meilleures offres
    public List<CarDetails> getOpportunitesArbitrage(String marque, String modele, Integer annee){
        Double valeurMarche = getCarMarketValue(marque, modele, annee);
        Double prixMax = valeurMarche - (valeurMarche * 0.15);

        // On appelle la méthode avec "PrixLessThan".
        return carDetailsRepository.findByMarqueAndModeleAndPrixLessThan(marque, modele, prixMax);
    }


}
