package com.amrTm.backLMS.DTO;

import java.util.List;

public class BookResponse {
	private List<BookDTOResp> data;
	private int sizeAllPage;
	public List<BookDTOResp> getData() {
		return data;
	}
	public void setData(List<BookDTOResp> data) {
		this.data = data;
	}
	public int getSizeAllPage() {
		return sizeAllPage;
	}
	public void setSizeAllPage(int sizeAllPage) {
		this.sizeAllPage = sizeAllPage;
	}
}
