package com.amrTm.backLMS.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.Book;

@Repository
public interface BookRepo extends JpaRepository<Book,String>,PagingAndSortingRepository<Book,String>, BookRepoFilter{
	public Page<Book> findAllByTitleContains(String title, Pageable page);
	public Page<Book> findAllByBookFavoriteId(long id, Pageable page);
	public Page<Book> findAllByBookUserId(long id, Pageable page);
	public Optional<Book> findOneByBookUserIdAndTitleAndPublisherBookName(long id,String title, String publisher);
	public Page<Book> findAllByTypeBooksId(int id, Pageable page);
	public Page<Book> findDistinctByTitleContainsOrBookUserNameContainsOrPublisherBookNameContains(String title, String name, String publisher, Pageable page);
	@Query("select distinct p from Book p join p.bookUser e join p.publisherBook r where (p.title like %?1% or r.name like %?2%) and e.id= ?3")
	public Page<Book> findAllBookUser(String title, String publisher, Long id1, Pageable page);
} 
