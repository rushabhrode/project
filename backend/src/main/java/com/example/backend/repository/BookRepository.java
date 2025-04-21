package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Book;

public interface BookRepository extends JpaRepository<Book, String> {}
