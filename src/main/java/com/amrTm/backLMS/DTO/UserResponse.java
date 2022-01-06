package com.amrTm.backLMS.DTO;

import java.util.List;

public class UserResponse {
	private List<UserInfoDTO> data;
	private int sizeAllData;
	public List<UserInfoDTO> getData() {
		return data;
	}
	public void setData(List<UserInfoDTO> data) {
		this.data = data;
	}
	public int getSizeAllData() {
		return sizeAllData;
	}
	public void setSizeAllData(int sizeAllData) {
		this.sizeAllData = sizeAllData;
	}
}
