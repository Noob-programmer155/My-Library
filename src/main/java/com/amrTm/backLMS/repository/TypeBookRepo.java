package com.amrTm.backLMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.TypeBook;

@Repository
public interface TypeBookRepo extends JpaRepository<TypeBook,Integer>{
	public TypeBook findByName(String name);
}
