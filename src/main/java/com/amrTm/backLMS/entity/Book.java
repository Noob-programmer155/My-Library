package com.amrTm.backLMS.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
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
	private String author;
	private String publisher;
	private Date publishDate;
	private String description;
	private int rekomended;
	@Enumerated
	private BookTheme theme;
	@Lob
	private byte[] data;
	@Lob
	private String image;
	@ManyToOne
	@JoinTable(name="Book_User", joinColumns= {@JoinColumn(name="Book_Id")}, inverseJoinColumns = {@JoinColumn(name="User_Id")})
	private User bookuser;
	@ManyToMany(cascade= {CascadeType.MERGE})
	@JoinTable(name="Favorite_Book", joinColumns={@JoinColumn(name="Book_Id")}, inverseJoinColumns={@JoinColumn(name="User_Id")})
	private Set<User> bookfavorite = new HashSet<>();
	
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
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public String getPublisher() {
		return publisher;
	}
	public void setPublisher(String publisher) {
		this.publisher = publisher;
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
	public BookTheme getTheme() {
		return theme;
	}
	public void setTheme(BookTheme theme) {
		this.theme = theme;
	}
	public byte[] getData() {
		return data;
	}
	public void setData(byte[] data) {
		this.data = data;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public void addFavorite(User user) {
		if(this.bookfavorite.contains(user)) return ;
		this.bookfavorite.add(user);
		user.addFavorite(this);
	}
	public void removeFavorite(User user) {
		if(!this.bookfavorite.contains(user)) return ;
		this.bookfavorite.remove(user);
		user.removeFavorite(this);
	}
	public User getBookuser() {
		return bookuser;
	}
	public void setBookuser(User bookuser) {
		this.bookuser = bookuser;
	}
	public Set<User> getBookfavorite() {
		return bookfavorite;
	}
	public int getRekomended() {
		return rekomended;
	}
	public void setRekomended(int rekomended) {
		this.rekomended = rekomended;
	}
}
