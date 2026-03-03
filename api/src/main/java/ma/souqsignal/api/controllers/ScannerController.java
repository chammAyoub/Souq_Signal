package ma.souqsignal.api.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/scanner")
@RequiredArgsConstructor
public class ScannerController {
    @PostMapping("/analyze")
    public ResponseEntity<String> analyze(){
        return new ResponseEntity<>("Scanner is working", HttpStatus.CREATED);
        // we'll add gemini API after
    }
}
