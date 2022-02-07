package com.amrTm.backLMS.DTO;

public class PublisherDTOResp {
	public Long id;
	public String name;
	public PublisherDTOResp() {
		super();
	}
	public PublisherDTOResp(Long id, String name) {
		super();
		this.id = id;
		this.name = name;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
