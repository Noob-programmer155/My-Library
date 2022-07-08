package com.amrTm.backLMS.DTO;

public class UserInfoDTO {
	private long id;
	private String name;
	private String email;
	private String role;
	private String image_url;
	private boolean status;

	public UserInfoDTO() {
	}

	public UserInfoDTO(Builder builder) {
		this.id = builder.id;
		this.name = builder.name;
		this.email = builder.email;
		this.role = builder.role;
		this.image_url = builder.image_url;
		this.status = builder.status;
	}

	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getImage_url() {
		return image_url;
	}
	public void setImage_url(String image_url) {
		this.image_url = image_url;
	}
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	public static class Builder{
		private long id;
		private String name;
		private String email;
		private String role;
		private String image_url;
		private boolean status;
		public Builder id(long id){
			this.id = id;
			return this;
		}
		public Builder name(String name){
			this.name = name;
			return this;
		}
		public Builder email(String email){
			this.email = email;
			return this;
		}
		public Builder role(String role){
			this.role = role;
			return this;
		}
		public Builder image(String image){
			this.image_url = image;
			return this;
		}
		public Builder status(Boolean status){
			this.status = status;
			return this;
		}
		public UserInfoDTO build(){
			return new UserInfoDTO(this);
		}
	}
}
