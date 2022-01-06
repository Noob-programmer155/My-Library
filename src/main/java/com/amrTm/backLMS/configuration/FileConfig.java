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

import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.FontFamily;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.amrTm.backLMS.entity.BookReport;
import com.amrTm.backLMS.entity.UserReport;
import com.amrTm.backLMS.repository.BookReportRepo;
import com.amrTm.backLMS.repository.UserReportRepo;

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
	private static String[] header1Book = {"User","","",
								"Book","","","","","","",
								"Status","Date Report"};
	private static String[] header2Book = {"","","",
								"Book ID","Book Title","Author","","","Publisher","",
								"",""};
	private static String[] header1User = {"User","","","Admin","","","Status","Date Report"};
	// this color index excesses by 1, because follow this method logic
	private static int[][] colorLocationIndexBook = {{3,10},{3,5,8,10}};
	private static int[] colorLocationIndexUser = {3,6};
	public static byte[] getReportFile(UserReportRepo userReportRepo,  BookReportRepo bookReportRepo, Date start, Date end, HttpServletResponse res) throws IOException {
		List<BookReport> bookReport = bookReportRepo.findAllByDateReportBetween(start, end);
		List<UserReport> userReport = userReportRepo.findAllByDateReportBetween(start, end);
		
		XSSFWorkbook worksheet = new XSSFWorkbook();
		
		XSSFCellStyle cellStyleHeader1 = setCellStyle(worksheet, IndexedColors.WHITE.getIndex(), IndexedColors.GREEN.getIndex(), FillPatternType.SOLID_FOREGROUND,
				FontFamily.MODERN, 12, true);
		XSSFCellStyle cellStyleHeader2 = setCellStyle(worksheet, IndexedColors.WHITE.getIndex(), IndexedColors.ORANGE.getIndex(), FillPatternType.SOLID_FOREGROUND,
				FontFamily.MODERN, 12, true);
		XSSFCellStyle cellStyleHeader3 = setCellStyle(worksheet, IndexedColors.WHITE.getIndex(), IndexedColors.RED.getIndex(), FillPatternType.SOLID_FOREGROUND,
				FontFamily.MODERN, 12, true);
		XSSFCellStyle cellStyleHeader4 = setCellStyle(worksheet, IndexedColors.WHITE.getIndex(), IndexedColors.BLUE.getIndex(), FillPatternType.SOLID_FOREGROUND,
				FontFamily.MODERN, 12, true);
		XSSFCellStyle cellStyleHeader5 = setCellStyle(worksheet, IndexedColors.WHITE.getIndex(), IndexedColors.DARK_YELLOW.getIndex(), FillPatternType.SOLID_FOREGROUND,
				FontFamily.MODERN, 12, true);
		XSSFCellStyle cellStyleBody1 = setCellStyle(worksheet, IndexedColors.GREEN.getIndex(), IndexedColors.LIGHT_GREEN.getIndex(), FillPatternType.SOLID_FOREGROUND,
				FontFamily.MODERN, 12, true);
		XSSFCellStyle cellStyleBody2 = setCellStyle(worksheet, IndexedColors.ORANGE.getIndex(), IndexedColors.LIGHT_ORANGE.getIndex(), FillPatternType.SOLID_FOREGROUND,
				FontFamily.MODERN, 12, true);
		XSSFCellStyle cellStyleBody3 = setCellStyle(worksheet, IndexedColors.RED.getIndex(), IndexedColors.TAN.getIndex(), FillPatternType.SOLID_FOREGROUND,
				FontFamily.MODERN, 12, true);
		XSSFCellStyle cellStyleBody4 = setCellStyle(worksheet, IndexedColors.BLUE.getIndex(), IndexedColors.AQUA.getIndex(), FillPatternType.SOLID_FOREGROUND,
				FontFamily.MODERN, 12, true);
		XSSFCellStyle cellStyleBody5 = setCellStyle(worksheet, IndexedColors.DARK_YELLOW.getIndex(), IndexedColors.LIGHT_YELLOW.getIndex(), FillPatternType.SOLID_FOREGROUND,
				FontFamily.MODERN, 12, true);
		
		XSSFSheet bookSheet = worksheet.createSheet("Book Report");
		XSSFRow headerRow1Book = bookSheet.createRow(row++);
		for(String item : header1Book) {
			XSSFCell cell = headerRow1Book.createCell(cellCountHBook++);
			if(cellCountHBook <= colorLocationIndexBook[0][0]) {cell.setCellStyle(cellStyleHeader2);}
			else if(cellCountHBook > colorLocationIndexBook[0][0] && cellCountHBook <= colorLocationIndexBook[0][1]) {cell.setCellStyle(cellStyleHeader1);} 
			else {cell.setCellStyle(cellStyleHeader4);}
			cell.setCellValue(item);
		}
		
		cellCountHBook = 0;
		XSSFRow headerRow2Book = bookSheet.createRow(row++);
		for(String item : header2Book) {
			XSSFCell cell = headerRow2Book.createCell(cellCountHBook++);
			if(cellCountHBook <= colorLocationIndexBook[1][0]) {cell.setCellStyle(cellStyleHeader2);}
			else if(cellCountHBook > colorLocationIndexBook[1][0] && cellCountHBook <= colorLocationIndexBook[1][1]) {cell.setCellStyle(cellStyleHeader1);}
			//color per units is different to make reading easier
			else if(cellCountHBook > colorLocationIndexBook[1][1] && cellCountHBook <= colorLocationIndexBook[1][2]) {cell.setCellStyle(cellStyleHeader3);}
			else if(cellCountHBook > colorLocationIndexBook[1][2] && cellCountHBook <= colorLocationIndexBook[1][3]) {cell.setCellStyle(cellStyleHeader5);} 
			else {cell.setCellStyle(cellStyleHeader4);}
			cell.setCellValue(item);
		}
		
		cellCountHBook = 0;
		XSSFRow headerRow3Book = bookSheet.createRow(row++);
		List<String> header3Book = new ArrayList<>();
		header3Book.add("");header3Book.add("");
		header3Book.addAll(Arrays.asList(user));
		header3Book.addAll(Arrays.asList(book[0]));
		header3Book.addAll(Arrays.asList(book[1]));
		header3Book.add("");header3Book.add("");
		header3Book.forEach(item -> {
			XSSFCell cell = headerRow3Book.createCell(cellCountHBook++);
			if(cellCountHBook <= colorLocationIndexBook[1][0]) {cell.setCellStyle(cellStyleHeader2);}
			else if(cellCountHBook > colorLocationIndexBook[1][0] && cellCountHBook <= colorLocationIndexBook[1][1]) {cell.setCellStyle(cellStyleHeader1);}
			//color per units is different to make reading easier
			else if(cellCountHBook > colorLocationIndexBook[1][1] && cellCountHBook <= colorLocationIndexBook[1][2]) {cell.setCellStyle(cellStyleHeader3);}
			else if(cellCountHBook > colorLocationIndexBook[1][2] && cellCountHBook <= colorLocationIndexBook[1][3]) {cell.setCellStyle(cellStyleHeader5);} 
			else {cell.setCellStyle(cellStyleHeader4);}
			cell.setCellValue(item);
		});
		
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
		
		bookReport.forEach(a -> {
			XSSFRow body = bookSheet.createRow(row++);
			int cellCountBBook = 0;
			for(Object item : Arrays.asList(a.getIdUser(),a.getUsername(),a.getEmail(),a.getIdBook(),a.getTitleBook(),a.getIdAuthor(),a.getNameAuthor(),
					a.getEmailAuthor(), a.getIdPublisher(), a.getNamePublisher(), a.getStatusReport().toString(), a.getDateReport())) {
				XSSFCell cell = body.createCell(cellCountBBook++);
				if(cellCountBBook <= colorLocationIndexBook[1][0]) {
					cell.setCellStyle(cellStyleBody2);
					if(item.getClass() == String.class) {cell.setCellValue((String)item);}
					else {cell.setCellValue((Long)item);}
				}
				else if(cellCountBBook > colorLocationIndexBook[1][0] && cellCountBBook <= colorLocationIndexBook[1][1]) {
					cell.setCellStyle(cellStyleBody1);
					cell.setCellValue((String)item);
				}
				//color per units is different to make reading easier
				else if(cellCountBBook > colorLocationIndexBook[1][1] && cellCountBBook <= colorLocationIndexBook[1][2]) {
					cell.setCellStyle(cellStyleBody3);
					if(item.getClass() == String.class) {cell.setCellValue((String)item);}
					else {cell.setCellValue((Long)item);}
				}
				else if(cellCountBBook > colorLocationIndexBook[1][2] && cellCountBBook <= colorLocationIndexBook[1][3]) {
					cell.setCellStyle(cellStyleBody5);
					if(item.getClass() == String.class) {cell.setCellValue((String)item);}
					else {cell.setCellValue((Long)item);}
				} 
				else {
					cell.setCellStyle(cellStyleBody4);
					if(item.getClass() == String.class) {cell.setCellValue((String)item);}
					else {cell.setCellValue((Date)item);}
				}
			}
		});
		
		row = 0;
		XSSFSheet userSheet = worksheet.createSheet("User Report");
		XSSFRow headerRow1User = userSheet.createRow(row++);
		for(String item : header1User) {
			XSSFCell cell = headerRow1User.createCell(cellCountHUser++);
			if(cellCountHUser <= colorLocationIndexUser[0]) {
				cell.setCellStyle(cellStyleHeader4);
			}
			else if(cellCountHUser > colorLocationIndexUser[0] && cellCountHUser <= colorLocationIndexUser[1]) {
				cell.setCellStyle(cellStyleHeader1);
			}
			else {cell.setCellStyle(cellStyleHeader2);}
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
			if(cellCountHUser <= colorLocationIndexUser[0]) {
				cell.setCellStyle(cellStyleHeader4);
			}
			else if(cellCountHUser > colorLocationIndexUser[0] && cellCountHUser <= colorLocationIndexUser[1]) {
				cell.setCellStyle(cellStyleHeader1);
			}
			else {cell.setCellStyle(cellStyleHeader2);}
			cell.setCellValue(item);
		});
		
		userSheet.addMergedRegion(new CellRangeAddress(0,0,0,2));
		userSheet.addMergedRegion(new CellRangeAddress(0,0,3,5));
		
		userReport.forEach(a -> {
			XSSFRow body = userSheet.createRow(row++);
			int cellCountBUser = 0;
			for(Object item : Arrays.asList(a.getIdUser(),a.getUsername(),a.getEmail(),a.getIdAdmin(),a.getAdminName(),a.getAdminEmail(),
					a.getStatusReport().toString(), a.getDateReport())) {
				XSSFCell cell = body.createCell(cellCountBUser++);
				if(cellCountBUser <= colorLocationIndexUser[0]) {
					cell.setCellStyle(cellStyleBody4);
					if(item.getClass() == String.class) {cell.setCellValue((String)item);}
					else {cell.setCellValue((Long)item);}
				}
				else if(cellCountBUser > colorLocationIndexUser[0] && cellCountBUser <= colorLocationIndexUser[1]) {
					cell.setCellStyle(cellStyleBody1);
					if(item.getClass() == String.class) {cell.setCellValue((String)item);}
					else {cell.setCellValue((Long)item);}
				}
				else {
					cell.setCellStyle(cellStyleBody2);
					if(item.getClass() == String.class) {cell.setCellValue((String)item);}
					else {cell.setCellValue((Date)item);}
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
	
	private static XSSFCellStyle setCellStyle(XSSFWorkbook worksheet, short fontColor, short bgColor, FillPatternType patternFillBg, FontFamily fontFamily, 
			double size, boolean bold) {
		XSSFFont font = new XSSFFont();
		font.setColor(fontColor);
		font.setBold(bold);
		font.setFamily(fontFamily);
		font.setFontHeight(size);
		
		XSSFCellStyle cellStyle = worksheet.createCellStyle();
		cellStyle.setWrapText(true);
		cellStyle.setAlignment(HorizontalAlignment.CENTER);
		cellStyle.setFont(font);
		cellStyle.setFillPattern(patternFillBg);
		cellStyle.setFillBackgroundColor(bgColor);
		
		return cellStyle;
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
