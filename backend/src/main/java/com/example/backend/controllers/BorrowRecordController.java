package com.example.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.BorrowRecord;
import com.example.backend.repository.BorrowRecordRepository;

@RestController
@RequestMapping("/api/borrowings")
public class BorrowRecordController {
    private final BorrowRecordRepository repo;
    public BorrowRecordController(BorrowRecordRepository repo) { this.repo = repo; }

    @GetMapping
    public List<BorrowRecord> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowRecord> getById(@PathVariable String id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public BorrowRecord create(@RequestBody BorrowRecord br) {
        return repo.save(br);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BorrowRecord> update(@PathVariable String id,
                                               @RequestBody BorrowRecord br) {
        return repo.findById(id).map(existing -> {
            existing.setBook(br.getBook());
            existing.setUser(br.getUser());
            existing.setBorrowDate(br.getBorrowDate());
            existing.setDueDate(br.getDueDate());
            existing.setReturnDate(br.getReturnDate());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
