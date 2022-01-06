package com.amrTm.backLMS.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class UserReport {
	@Id
	@GeneratedValue
	private Long id;
	private Long idUser;
	private String username;
	private String email;
	private Long idAdmin;
	private String adminName;
	private String adminEmail;
	@Enumerated
	private StatusReport statusReport;
	private Date dateReport;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getIdUser() {
		return idUser;
	}
	public void setIdUser(Long idUser) {
		this.idUser = idUser;
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
	public Long getIdAdmin() {
		return idAdmin;
	}
	public void setIdAdmin(Long invalid) {
		this.idAdmin = invalid;
	}
	public String getAdminName() {
		return adminName;
	}
	public void setAdminName(String adminName) {
		this.adminName = adminName;
	}
	public String getAdminEmail() {
		return adminEmail;
	}
	public void setAdminEmail(String adminEmail) {
		this.adminEmail = adminEmail;
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
