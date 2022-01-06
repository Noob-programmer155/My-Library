package com.amrTm.backLMS.DTO;

import java.util.List;

public class TypeResponse {
	private List<TypeDTOResp> data;
	private int sizeAllPage;
	public List<TypeDTOResp> getData() {
		return data;
	}
	public void setData(List<TypeDTOResp> data) {
		this.data = data;
	}
	public int getSizeAllPage() {
		return sizeAllPage;
	}
	public void setSizeAllPage(int sizeAllPage) {
		this.sizeAllPage = sizeAllPage;
	}
}
