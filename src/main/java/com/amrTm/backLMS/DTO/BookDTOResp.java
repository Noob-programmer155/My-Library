package com.amrTm.backLMS.DTO;

import java.util.List;

public class BookDTOResp {
	private String id;
	private String title;
	private String author;
	private PublisherDTOResp publisher;
	private String publishDate;
	private String description;
	private List<TypeDTOResp> theme;
	private String file;
	private String image;
	private boolean favorite;
	private boolean status;
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
	public PublisherDTOResp getPublisher() {
		return publisher;
	}
	public void setPublisher(PublisherDTOResp publisher) {
		this.publisher = publisher;
	}
	public String getPublishDate() {
		return publishDate;
	}
	public void setPublishDate(String publishDate) {
		this.publishDate = publishDate;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<TypeDTOResp> getTheme() {
		return theme;
	}
	public void setTheme(List<TypeDTOResp> theme) {
		this.theme = theme;
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
	public boolean getFavorite() {
		return favorite;
	}
	public void setFavorite(boolean favorite) {
		this.favorite = favorite;
	}
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
}
