package com.amrTm.backLMS.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class BookReport {
	@Id
	@GeneratedValue
	private Long id;
	private String idBook;
	private String titleBook;
	private Long idAuthor;
	private String nameAuthor;
	private String emailAuthor;
	private Long idPublisher;
	private String namePublisher;
	private Long idUser;
	private String username;
	private String email;
	@Enumerated
	private StatusReport statusReport;
	private Date dateReport;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getIdBook() {
		return idBook;
	}
	public void setIdBook(String idBook) {
		this.idBook = idBook;
	}
	public String getTitleBook() {
		return titleBook;
	}
	public void setTitleBook(String titleBook) {
		this.titleBook = titleBook;
	}
	public Long getIdAuthor() {
		return idAuthor;
	}
	public void setIdAuthor(Long idAuthor) {
		this.idAuthor = idAuthor;
	}
	public String getNameAuthor() {
		return nameAuthor;
	}
	public void setNameAuthor(String nameAuthor) {
		this.nameAuthor = nameAuthor;
	}
	public String getEmailAuthor() {
		return emailAuthor;
	}
	public void setEmailAuthor(String emailAuthor) {
		this.emailAuthor = emailAuthor;
	}
	public Long getIdPublisher() {
		return idPublisher;
	}
	public void setIdPublisher(Long idPublisher) {
		this.idPublisher = idPublisher;
	}
	public String getNamePublisher() {
		return namePublisher;
	}
	public void setNamePublisher(String namePublisher) {
		this.namePublisher = namePublisher;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Long getIdUser() {
		return idUser;
	}
	public void setIdUser(Long idUser) {
		this.idUser = idUser;
	}
	public StatusReport getStatusReport() {
		return statusReport;
	}
	public void setStatusReport(StatusReport statusReport) {
		this.statusReport = statusReport;
	}
	public Date getDateReport() {
		return dateReport;
	}
	public void setDateReport(Date dateReport) {
		this.dateReport = dateReport;
	}
}
