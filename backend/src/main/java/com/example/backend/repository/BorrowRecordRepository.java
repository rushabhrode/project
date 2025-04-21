package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.BorrowRecord;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, String> {}
