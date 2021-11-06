package com.amrTm.backLMS.configuration;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileConfig {
	public static String saveImageBook(byte[] data, String name) throws IOException {
		File fd = new File("classpath:image/book/"+name);
		fd.createNewFile();
		FileOutputStream output = new FileOutputStream(fd);
		output.write(data);
		output.close();
		return name;
	}
	
	public static String saveImageUser(byte[] data, String name) throws IOException {
		File fd = new File("classpath:image/user/"+name);
		fd.createNewFile();
		FileOutputStream output = new FileOutputStream(fd);
		output.write(data);
		output.close();
		return name;
	}
	
	public static String saveFileBook(byte[] data, String name) throws IOException {
		File fd = new File("classpath:file/"+name);
		fd.createNewFile();
		FileOutputStream output = new FileOutputStream(fd);
		output.write(data);
		output.close();
		return name;
	}
}
