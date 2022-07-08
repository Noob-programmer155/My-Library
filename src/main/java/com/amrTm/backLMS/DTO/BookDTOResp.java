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

	public BookDTOResp() {
	}

	public BookDTOResp(Builder builder) {
		this.id = builder.id;
		this.title = builder.title;
		this.author = builder.author;
		this.publisher = builder.publisher;
		this.publishDate = builder.publishDate;
		this.description = builder.description;
		this.theme = builder.theme;
		this.file = builder.file;
		this.image = builder.image;
		this.favorite = builder.favorite;
		this.status = builder.status;
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

	public static class Builder {
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
		public Builder id(String id) {
			this.id = id;
			return this;
		}
		public Builder title(String title) {
			this.title = title;
			return this;
		}
		public Builder author(String author) {
			this.author = author;
			return this;
		}
		public Builder publisher(PublisherDTOResp publisher) {
			this.publisher = publisher;
			return this;
		}
		public Builder date(String date) {
			this.publishDate = date;
			return this;
		}
		public Builder description(String description) {
			this.description = description;
			return this;
		}
		public Builder theme(List<TypeDTOResp> themes) {
			this.theme = themes;
			return this;
		}
		public Builder file(String file) {
			this.file = file;
			return this;
		}
		public Builder image(String image) {
			this.image = image;
			return this;
		}
		public Builder favorite(Boolean favorite) {
			this.favorite = favorite;
			return this;
		}
		public Builder status(Boolean status) {
			this.status = status;
			return this;
		}
		public BookDTOResp build() {
			return new BookDTOResp(this);
		}
	}
}
