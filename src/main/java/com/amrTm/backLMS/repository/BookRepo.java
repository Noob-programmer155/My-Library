package com.amrTm.backLMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.Book;

@Repository
public interface BookRepo extends JpaRepository<Book,String>{
}
