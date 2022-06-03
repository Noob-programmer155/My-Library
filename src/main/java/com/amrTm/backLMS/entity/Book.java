package com.amrTm.backLMS.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.annotations.SortComparator;

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
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinTable(name="Book_User", joinColumns= {@JoinColumn(name="Book_Id")}, inverseJoinColumns = {@JoinColumn(name="User_Id")})
	@NotNull
	private User bookUser;
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinTable(name="Book_Publisher", joinColumns= {@JoinColumn(name="Book_Id")}, inverseJoinColumns = {@JoinColumn(name="Publisher_Id")})
	@NotNull
	private Publisher publisherBook;
	@ManyToMany(cascade= {CascadeType.PERSIST,CascadeType.MERGE})
	@JoinTable(name="Favorite_Book", joinColumns={@JoinColumn(name="Book_Id")}, inverseJoinColumns={@JoinColumn(name="User_Id")})
//	@SortComparator(value = )
	private Set<User> bookFavorite= new HashSet<>();
	@ManyToMany(mappedBy="bookType")
	private Set<TypeBook> typeBooks = new HashSet<>();
	
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
		if(this.typeBooks.contains(typeBook)) return ;
		this.typeBooks.add(typeBook);
		typeBook.addBook(this);
	}
	public void removeType(TypeBook typeBook) {
		if(!this.typeBooks.contains(typeBook)) return ;
		this.typeBooks.remove(typeBook);
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
	public Set<TypeBook> getTypeBooks() {
		return typeBooks;
	}
}
