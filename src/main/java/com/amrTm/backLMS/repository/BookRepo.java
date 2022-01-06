package com.amrTm.backLMS.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.Book;

@Repository
public interface BookRepo extends PagingAndSortingRepository<Book,String>, BookRepoFilter{
	public Page<Book> findAllByTitleContains(String title, Pageable page);
	public Page<Book> findAllByBookFavoriteId(long id, Pageable page);
	public Page<Book> findAllByBookUserId(long id, Pageable page);
	public Page<Book> findAllByBooksId(int id, Pageable page);
	public Page<Book> findAllByTitleContainsOrBookUserNameContainsOrPublisherBookNameContains(String title, String name, String publisher, Pageable page);
	public Page<Book> findAllByTitleContainsOrPublisherBookNameContainsAndBookUserId(String title, String publisher, Long id, Pageable page);
} 
