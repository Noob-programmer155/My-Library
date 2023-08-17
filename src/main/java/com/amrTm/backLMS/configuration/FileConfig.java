package com.amrTm.backLMS.configuration;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.FontFamily;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.amrTm.backLMS.entity.BookReport;
import com.amrTm.backLMS.entity.UserReport;
import com.amrTm.backLMS.repository.BookReportRepo;
import com.amrTm.backLMS.repository.UserReportRepo;

@Component
public class FileConfig {
	private static final String IMAGE_EKS= "png", FILE_EKS = "pdf";
	@Value("${filestorage}")
	private String path;
	public String saveImageBook(MultipartFile data,  String name) throws IOException {
		String nm = name+'.'+IMAGE_EKS;
		File dir = new File(path+"/image/book");
		if(!dir.exists()){
			dir.mkdirs();
		}
		File fd = new File(path+"/image/book/"+nm);
		fd.createNewFile();
		FileOutputStream output = new FileOutputStream(fd);
		output.write(data.getBytes());
		output.flush();
		output.close();
		return nm;
	}
	public String saveImageUser(MultipartFile data, String name) throws IOException {
		String nm = name+'.'+IMAGE_EKS;
		File dir = new File(path+"/image/user");
		if(!dir.exists()){
			dir.mkdirs();
		}
		File fd = new File(path+"/image/user/"+nm);
		fd.createNewFile();
		FileOutputStream output = new FileOutputStream(fd);
		output.write(data.getBytes());
		output.flush();
		output.close();
		return nm;
	}
	
	public String saveFileBook(MultipartFile data, String name, boolean modify) throws IOException {
		String nm = null;
		File fd = null;
		File dir = new File(path+"/file");
		if(!dir.exists()){
			dir.mkdirs();
		}
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

	public String modifyImageUser(MultipartFile decode, String image_url) throws IOException {
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

	public String modifyImageBook(MultipartFile decode, String image) throws IOException {
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
	
	public boolean deleteBooksFile(String nameFile) {
		File newfd = new File(path+"/file/"+nameFile);
		return newfd.delete();
	}
	
	public boolean deleteBooksImage(String nameFile) {
		File newfd = new File(path+"/image/book/"+nameFile);
		return newfd.delete();
	}
	
	public boolean deleteUserImage(String nameFile) {
		if(nameFile.substring(0, 4).equals("http")) {
			return true;
		}
		File newfd = new File(path+"/image/user/"+nameFile);
		return newfd.delete();
	}
	
	private static int row = 0;
	static int cellCountHBook = 0;
	static int cellCountHUser = 0;
	private static String[] user = {"User ID","Username","User Email"};
	private static String[] author = {"Author ID","Author Name","Author Email"};
	private static String[] publisher = {"Publisher ID","Publisher Name"};
	private static String[][] book = {author,publisher};
	private static String[] admin = {"Admin ID","Admin Name","Admin Email"};
	private static String[] header1Book = {"User","","","Book","","","","","","","Status","Date Report"};
	private static String[] header2Book = {"","","","Book ID","Book Title","Author","","","Publisher"};
	private static String[] header1User = {"User","","","Admin","","","Status","Date Report"};
	public static byte[] getReportFile(UserReportRepo userReportRepo,  BookReportRepo bookReportRepo, Date start, Date end, HttpServletResponse res) throws IOException {
		row = 0;
		cellCountHBook = 0;
		cellCountHUser = 0;
		List<BookReport> bookReport = bookReportRepo.findAllByDateReportBetween(start, end);
		List<UserReport> userReport = userReportRepo.findAllByDateReportBetween(start, end);
		
		XSSFWorkbook worksheet = new XSSFWorkbook();
		
		XSSFSheet bookSheet = worksheet.createSheet("Book Report");
		XSSFFont font1 = bookSheet.getWorkbook().createFont();
		font1.setBold(true);
		font1.setFamily(FontFamily.SWISS);
		font1.setFontHeight(12);
		XSSFCellStyle style1 = bookSheet.getWorkbook().createCellStyle();
		style1.setFont(font1);
		style1.setWrapText(true);
		style1.setAlignment(HorizontalAlignment.CENTER);
		style1.setVerticalAlignment(VerticalAlignment.CENTER);
		
		// merging cell user units
		bookSheet.addMergedRegion(new CellRangeAddress(0,1,0,2));
		
		//merging cell book units
		bookSheet.addMergedRegion(new CellRangeAddress(0,0,3,9));
		bookSheet.addMergedRegion(new CellRangeAddress(1,2,3,3));
		bookSheet.addMergedRegion(new CellRangeAddress(1,2,4,4));
		bookSheet.addMergedRegion(new CellRangeAddress(1,1,5,7));
		bookSheet.addMergedRegion(new CellRangeAddress(1,1,8,9));
		
		// merging additional variables
		bookSheet.addMergedRegion(new CellRangeAddress(0,2,10,10));
		bookSheet.addMergedRegion(new CellRangeAddress(0,2,11,11));
		
		XSSFRow headerRow1Book = bookSheet.createRow(row++);
		for(String item : header1Book) {
			XSSFCell cell = headerRow1Book.createCell(cellCountHBook++);
			cell.setCellStyle(style1);
			cell.setCellValue(item);
		}
		
		cellCountHBook = 0;
		XSSFRow headerRow2Book = bookSheet.createRow(row++);
		for(String item : header2Book) {
			XSSFCell cell = headerRow2Book.createCell(cellCountHBook++);
			cell.setCellStyle(style1);
			cell.setCellValue(item);
		}
		
		cellCountHBook = 0;
		XSSFRow headerRow3Book = bookSheet.createRow(row++);
		List<String> header3Book = new ArrayList<>();
		header3Book.addAll(Arrays.asList(user));
		header3Book.add("");header3Book.add("");
		header3Book.addAll(Arrays.asList(book[0]));
		header3Book.addAll(Arrays.asList(book[1]));
		header3Book.add("");header3Book.add("");
		header3Book.forEach(item -> {
			XSSFCell cell = headerRow3Book.createCell(cellCountHBook++);
			cell.setCellStyle(style1);
			cell.setCellValue(item);
		});
		
		bookReport.forEach(book -> {
			XSSFRow body = bookSheet.createRow(row++);
			int cellCountBBook = 0;
			for(Object item : Arrays.asList(book.getIdUser(),book.getUsername(),book.getEmail(),book.getIdBook(),book.getTitleBook(),book.getIdAuthor(),book.getNameAuthor(),
					book.getEmailAuthor(), book.getIdPublisher(), book.getNamePublisher(), book.getStatusReport().toString(), book.getDateReport())) {
				XSSFCell cell = body.createCell(cellCountBBook++);
				if(item.getClass() == String.class) {cell.setCellValue((String)item);}
				else if(item.getClass() == Long.class) {cell.setCellValue((Long)item);}
				else {cell.setCellValue((Date)item);}
			}
		});
		
		row = 0;
		XSSFSheet userSheet = worksheet.createSheet("User Report");
		
		userSheet.addMergedRegion(new CellRangeAddress(0,0,0,2));
		userSheet.addMergedRegion(new CellRangeAddress(0,0,3,5));
		userSheet.addMergedRegion(new CellRangeAddress(0,1,6,6));
		userSheet.addMergedRegion(new CellRangeAddress(0,1,7,7));
		
		XSSFRow headerRow1User = userSheet.createRow(row++);
		for(String item : header1User) {
			XSSFCell cell = headerRow1User.createCell(cellCountHUser++);
			cell.setCellStyle(style1);
			cell.setCellValue(item);
		}
		XSSFRow headerRow2User = userSheet.createRow(row++);
		cellCountHUser = 0;
		List<String> header2User = new ArrayList<>();
		header2User.addAll(Arrays.asList(user));
		header2User.addAll(Arrays.asList(admin));
		header2User.add("");header2User.add("");
		header2User.forEach(item -> {
			XSSFCell cell = headerRow2User.createCell(cellCountHUser++);
			cell.setCellStyle(style1);
			cell.setCellValue(item);
		});
		
		userReport.forEach(user -> {
			XSSFRow body = userSheet.createRow(row++);
			int cellCountBUser = 0;
			for(Object item : Arrays.asList(user.getIdUser(),user.getUsername(),user.getEmail(),user.getIdAdmin(),user.getAdminName(),user.getAdminEmail(),
					user.getStatusReport().toString(), user.getDateReport())) {
				XSSFCell cell = body.createCell(cellCountBUser++);
				if(item != null) {
					if(item.getClass() == String.class) {cell.setCellValue((String)item);}
					else if(item.getClass() == Long.class){cell.setCellValue((Long)item);}
					else {cell.setCellValue((Date)item);}
				}else {
					cell.setCellValue("undefined");
				}
			}
		});
		ByteArrayOutputStream data = new ByteArrayOutputStream();
		try {
			worksheet.write(data);
			worksheet.close();
		} catch (IOException e) {
			res.sendError(500, "Can`t make data report, Server find some error when fetching data");
		}
		return data.toByteArray();
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
