package com.amrTm.backLMS.DTO;

import java.util.List;

public class BookDTO {
	private String id;
	private String title;
	private String newPublisher;
	private Integer publisher;
	private String description;
	private List<Integer> theme;
	private List<String> newTheme;
	private boolean favorite;
	public BookDTO() {
		super();
	}
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
	public Integer getPublisher() {
		return publisher;
	}
	public void setPublisher(Integer publisher) {
		this.publisher = publisher;
	}
	public String getNewPublisher() {
		return newPublisher;
	}
	public void setNewPublisher(String newPublisher) {
		this.newPublisher = newPublisher;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<Integer> getTheme() {
		return theme;
	}
	public void setTheme(List<Integer> theme) {
		this.theme = theme;
	}
	public List<String> getNewTheme() {
		return newTheme;
	}
	public void setNewTheme(List<String> newTheme) {
		this.newTheme = newTheme;
	}
	public boolean getFavorite() {
		return favorite;
	}
	public void setFavorite(boolean favorite) {
		this.favorite = favorite;
	}
}
