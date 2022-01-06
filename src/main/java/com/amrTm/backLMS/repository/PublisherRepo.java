package com.amrTm.backLMS.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.Publisher;

@Repository
public interface PublisherRepo extends PagingAndSortingRepository<Publisher, Long> {
	public Page<Publisher> findAllByNameContains(String name, Pageable data);
}
