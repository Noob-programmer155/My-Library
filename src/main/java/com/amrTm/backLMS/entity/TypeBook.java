package com.amrTm.backLMS.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.annotations.SortComparator;

@Entity
@JsonIdentityInfo(
		generator = ObjectIdGenerators.PropertyGenerator.class,
		property = "id")
public class TypeBook {
	@Id
	@GeneratedValue
	private int id;
	@Column(unique=true)
	private String name;
	@ManyToMany(cascade= {CascadeType.PERSIST,CascadeType.MERGE})
	@JoinTable(name="Type_Book", joinColumns={@JoinColumn(name="Book_Id")}, inverseJoinColumns={@JoinColumn(name="Type_Id")})
//	@SortComparator()
	private Set<Book> bookType = new HashSet<>();
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void addBook(Book book) {
		if(this.bookType.contains(book)) return ;
		this.bookType.add(book);
		book.addType(this);
	}
	public void removeBook(Book book) {
		if(!this.bookType.contains(book)) return ;
		this.bookType.remove(book);
		book.removeType(this);
	}
}
