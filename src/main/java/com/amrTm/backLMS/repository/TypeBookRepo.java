package com.amrTm.backLMS.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.TypeBook;

@Repository
public interface TypeBookRepo extends PagingAndSortingRepository<TypeBook,Integer>{
	public TypeBook findByName(String name);
	public Page<TypeBook> findAllDistinctByBookTypeNotEmpty(Pageable page);
	public Page<TypeBook> findAllByNameContains(String name, Pageable page);
}
