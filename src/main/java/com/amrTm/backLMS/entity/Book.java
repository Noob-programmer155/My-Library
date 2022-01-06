package com.amrTm.backLMS.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(
		generator = ObjectIdGenerators.PropertyGenerator.class,
		property = "id")
public class Book {
	@Id
	private String id;
	private String title;
	private Date publishDate;
	@Column(length=5000000)
	private String description;
	// using this variable to get recommended book from the numbers of download
	private int rekomended;
	@Column(nullable=false)
	private String file;
	@Column(nullable=false)
	private String image;
	@ManyToOne
	@JoinTable(name="Book_User", joinColumns= {@JoinColumn(name="Book_Id")}, inverseJoinColumns = {@JoinColumn(name="User_Id")})
	private User bookUser;
	@ManyToOne
	@JoinTable(name="Book_Publisher", joinColumns= {@JoinColumn(name="Book_Id")}, inverseJoinColumns = {@JoinColumn(name="Publisher_Id")})
	private Publisher publisherBook;
	@ManyToMany(cascade= {CascadeType.MERGE})
	@JoinTable(name="Favorite_Book", joinColumns={@JoinColumn(name="Book_Id")}, inverseJoinColumns={@JoinColumn(name="User_Id")})
	private Set<User> bookFavorite= new HashSet<>();
	@ManyToMany(mappedBy="bookType")
	private Set<TypeBook> books = new HashSet<>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Date getPublishDate() {
		return publishDate;
	}
	public void setPublishDate(Date publishDate) {
		this.publishDate = publishDate;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getFile() {
		return file;
	}
	public void setFile(String file) {
		this.file = file;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public void addFavorite(User user) {
		if(this.bookFavorite.contains(user)) return ;
		this.bookFavorite.add(user);
		user.addFavorite(this);
	}
	public void removeFavorite(User user) {
		if(!this.bookFavorite.contains(user)) return ;
		this.bookFavorite.remove(user);
		user.removeFavorite(this);
	}
	public void addType(TypeBook typeBook) {
		if(this.books.contains(typeBook)) return ;
		this.books.add(typeBook);
		typeBook.addBook(this);
	}
	public void removeType(TypeBook typeBook) {
		if(!this.books.contains(typeBook)) return ;
		this.books.add(typeBook);
		typeBook.removeBook(this);
	}
	public User getBookUser() {
		return bookUser;
	}
	public void setBookUser(User bookuser) {
		this.bookUser = bookuser;
	}
	public Set<User> getBookFavorite() {
		return bookFavorite;
	}
	public int getRekomended() {
		return rekomended;
	}
	public void setRekomended(int rekomended) {
		this.rekomended = rekomended;
	}
	public Publisher getPublisherBook() {
		return publisherBook;
	}
	public void setPublisherBook(Publisher publisherBook) {
		this.publisherBook = publisherBook;
	}
	public Set<TypeBook> getBooks() {
		return books;
	}
}
