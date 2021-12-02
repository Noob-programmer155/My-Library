package com.amrTm.backLMS.configuration;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

public class FileConfig {
	private static final String IMAGE_EKS= "png", FILE_EKS = "pdf";
	private static final String path = "src/main/resources/static";
	public static String saveImageBook(MultipartFile data,  String name) throws IOException {
		String nm = name+'.'+IMAGE_EKS;
		File fd = new File(path+"/image/book/"+nm);
		fd.createNewFile();
		FileOutputStream output = new FileOutputStream(fd);
		output.write(data.getBytes());
		output.flush();
		output.close();
		return nm;
	}
	public static String saveImageUser(MultipartFile data, String name) throws IOException {
		String nm = name+'.'+IMAGE_EKS;
		File fd = new File(path+"/image/user/"+nm);
		fd.createNewFile();
		FileOutputStream output = new FileOutputStream(fd);
		output.write(data.getBytes());
		output.flush();
		output.close();
		return nm;
	}
	
	public static String saveFileBook(MultipartFile data, String name, boolean modify) throws IOException {
		String nm = null;
		File fd = null;
		if(!modify) {
			nm = name+'.'+FILE_EKS;
			fd = new File(path+"/file/"+nm);
			fd.createNewFile();
		}
		else {
			nm = name;
			fd = new File(path+"/file/"+nm);}
		FileOutputStream output = new FileOutputStream(fd);
		output.write(data.getBytes());
		output.flush();
		output.close();
		return nm;
	}

	public static String modifyImageUser(MultipartFile decode, String image_url) throws IOException {
		String newFile = null;
		if(image_url != null) newFile = image_url;
		else newFile = new SimpleDateFormat("ddMMyyyyhhmmssSSS").format(new Date())+"."+IMAGE_EKS;
		File newfd = new File(path+"/image/user/"+newFile);
		if(newfd.exists()) {
			FileOutputStream output = new FileOutputStream(newfd);
			output.write(decode.getBytes());
			output.flush();
			output.close();
		}
		else {
//			if(image_url != null) {
//				File fd = new File(path+"/image/user/"+image_url);
//				if(fd.delete()) {
//					newfd.createNewFile();
//					FileOutputStream output = new FileOutputStream(newfd);
//					output.write(decode.getBytes());
//					output.close();
//				}
//			}
			newfd.createNewFile();
			FileOutputStream output = new FileOutputStream(newfd);
			output.write(decode.getBytes());
			output.flush();
			output.close();
		}
		return newFile;
	}

	public static String modifyImageBook(MultipartFile decode, String image) throws IOException {
		String newFile = null;
		if(image != null) newFile = image;
		else newFile = new SimpleDateFormat("ddMMyyyyhhmmssSSS").format(new Date())+"."+IMAGE_EKS;
		File newfd = new File(path+"/image/book/"+newFile);
		if(newfd.exists()) {
			FileOutputStream output = new FileOutputStream(newfd);
			output.write(decode.getBytes());
			output.flush();
			output.close();
		}
		else {
			newfd.createNewFile();
			FileOutputStream output = new FileOutputStream(newfd);
			output.write(decode.getBytes());
			output.flush();
			output.close();
		}
		return newFile;
	}
	
	public static boolean deleteBooksFile(String nameFile) {
		File newfd = new File(path+"/file/"+nameFile);
		return newfd.delete();
	}
	
	public static boolean deleteBooksImage(String nameFile) {
		File newfd = new File(path+"/image/book/"+nameFile);
		return newfd.delete();
	}
	
	public static boolean deleteUserImage(String nameFile) {
		File newfd = new File(path+"/image/user/"+nameFile);
		return newfd.delete();
	}
	
//	private static byte[] getImage(MultipartFile image, int x, int y, int size, String ekstention) throws IOException {
//		BufferedImage data = ImageIO.read(image.getInputStream());
//		
//		BufferedImage result = new BufferedImage(size,size,BufferedImage.TYPE_4BYTE_ABGR);
//		Graphics2D graphics = result.createGraphics();
//		graphics.drawImage(data, x, y, size, size, null);
//		graphics.dispose();
//		
//		ByteArrayOutputStream output = new ByteArrayOutputStream();
//		ImageIO.write(result, ekstention, output);
//		return output.toByteArray();
//	}
}
