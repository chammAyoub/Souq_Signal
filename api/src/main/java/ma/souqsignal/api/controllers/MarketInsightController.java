package ma.souqsignal.api.controllers;


import lombok.RequiredArgsConstructor;
import ma.souqsignal.api.entities.MarketInsight;
import ma.souqsignal.api.services.MarketInsightService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/insights")
@RequiredArgsConstructor
public class MarketInsightController {
    private final MarketInsightService marketInsightService;

    @GetMapping("/dashboard")
    public ResponseEntity<List<MarketInsight>> getDerniersInsights(){
        List<MarketInsight> dernierInsights = marketInsightService.getDerniersInsights();
        if(!dernierInsights.isEmpty()){
            return new ResponseEntity<>(dernierInsights, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("")
    public ResponseEntity<List<MarketInsight>> getAllInsights(){
        List<MarketInsight> allInsights = marketInsightService.getAllInsights();
        if(!allInsights.isEmpty()){
            return new ResponseEntity<>(allInsights,HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarketInsight> getMarketInsightById(@PathVariable Long id) {
        // si l'id n'existe pas, le service lance l'exception.
        MarketInsight insight = marketInsightService.getMarketInsightById(id);
        return ResponseEntity.ok(insight);
    }

    @PostMapping
    public ResponseEntity<MarketInsight> saveNouvelInsight(@RequestBody MarketInsight marketInsight){
        MarketInsight NouvelInsight = marketInsightService.saveNouvelInsight(marketInsight);
        return new ResponseEntity<>(NouvelInsight, HttpStatus.CREATED);
    }



}
