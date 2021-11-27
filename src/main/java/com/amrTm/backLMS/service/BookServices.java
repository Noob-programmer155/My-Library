package com.amrTm.backLMS.service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amrTm.backLMS.DTO.BookDTO;
import com.amrTm.backLMS.DTO.BookDTOResp;
import com.amrTm.backLMS.configuration.FileConfig;
import com.amrTm.backLMS.entity.Book;
import com.amrTm.backLMS.entity.TypeBook;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.repository.BookRepo;
import com.amrTm.backLMS.repository.TypeBookRepo;
import com.amrTm.backLMS.repository.UserRepo;

@Service
public class BookServices {
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private BookRepo bookRepo;
	@Autowired
	private TypeBookRepo typeBookRepo;
	
//	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
//	public BookDTOResp getBook(String id) {
//		return bookRepo.findById(id).map(a-> {
//			BookDTOResp book = new BookDTOResp();
//			book.setId(a.getId());
//			book.setAuthor(a.getAuthor());
//			book.setFavorite(a.getBookFav().stream().filter(a -> ));
//			book.setDescription(a.getDescription());
//			book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(a.getPublishDate()));
//			book.setPublisher(a.getPublisher());
//			book.setStatus(a.isStatus());
//			book.setTheme(a.getTheme().toString());
//			book.setData(a.getData());
//			book.setImage(a.getImage());
//			book.setTitle(a.getTitle());
//			return book;
//		}).get();
//	}
	public byte[] getImageBook(String path) throws IOException {
		ClassPathResource resource = new ClassPathResource("static/image/book/"+path);
		return resource.getInputStream().readAllBytes();
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public Resource getFileBook(String path) throws IOException {
		ClassPathResource resource = new ClassPathResource("static/file/"+path);
		return resource;
	}
	
	public List<BookDTOResp> getAllBook() {
		return bookRepo.findAll(Sort.by("rekomended").descending()).stream().map(a -> {
			BookDTOResp book = new BookDTOResp();
			book.setId(a.getId());
			book.setAuthor(a.getAuthor());
			book.setFavorite(false);
			book.setDescription(a.getDescription());
			book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(a.getPublishDate()));
			book.setPublisher(a.getPublisher());
			book.setStatus(false);
			book.setTheme(a.getType());
			book.setFile(null);
			book.setImage(a.getImage());
			book.setTitle(a.getTitle());
			return book;
		}).collect(Collectors.toList());
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public List<BookDTOResp> getAllBook(long id) {
		return bookRepo.findAll(Sort.by("rekomended").descending()).stream().map(a -> {
			BookDTOResp book = new BookDTOResp();
			book.setId(a.getId());
			book.setAuthor(a.getAuthor());
			book.setFavorite(a.getBookfavorite().stream().anyMatch(g -> g.getId() == id));
			book.setDescription(a.getDescription());
			book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(a.getPublishDate()));
			book.setPublisher(a.getPublisher());
			book.setStatus(a.getBookuser().getId() == id);
			book.setTheme(a.getType());
			book.setFile(a.getFile());
			book.setImage(a.getImage());
			book.setTitle(a.getTitle());
			return book;
		}).collect(Collectors.toList());
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public List<BookDTOResp> getMyBook(int id){
		User user = userRepo.findById((long) id).get();
		if(!user.getMyBook().isEmpty()) {
			return user.getMyBook().stream().map(s -> {
				BookDTOResp book = new BookDTOResp();
				book.setId(s.getId());
				book.setAuthor(s.getAuthor());
				book.setFavorite(s.getBookfavorite().stream().anyMatch(g -> g.getId() == id));
				book.setDescription(s.getDescription());
				book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(s.getPublishDate()));
				book.setPublisher(s.getPublisher());
				book.setStatus(s.getBookuser().getId() == id);
				book.setTheme(s.getType());
				book.setFile(s.getFile());
				book.setImage(s.getImage());
				book.setTitle(s.getTitle());
				return book;
			}).collect(Collectors.toList());
		}
		return null;
	}
	
	@PreAuthorize("hasAuthority('SELLER')")
	public List<String> getType(){
		return typeBookRepo.findAll().stream().map(a -> {
			return a.getName();
		}).collect(Collectors.toList());
	}
	
	@PreAuthorize("hasAuthority('SELLER')")
	public void addBook(BookDTO book, MultipartFile file, MultipartFile image) {
		StringBuffer sb = new StringBuffer();
		int c = (int)bookRepo.count();
		sb.append(c+1+":");
		String[] sa1 = book.getTitle().split(" ");
		for (String d : sa1) {sb.append(d.charAt(0));}
		String[] sa2 = book.getAuthor().split(" ");
		for (String d : sa2) {sb.append(d.charAt(0));}
		Book bfs = new Book();
		bfs.setId(sb.toString());
		bfs.setAuthor(book.getAuthor());
		bfs.setDescription(book.getDescription());
		bfs.setPublishDate(new Date());
		bfs.setPublisher(book.getPublisher());
		bfs.setType(book.getTheme());
		bfs.setRekomended(0);
		bfs.setTitle(book.getTitle());
		if(!file.isEmpty() || file != null) {
			try {
				bfs.setFile(FileConfig.saveFileBook(file, new SimpleDateFormat("ddMMyyyyhhmmssSSS").format(new Date()),false));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		if(!image.isEmpty() || image != null) {
			try {
				bfs.setImage(FileConfig.saveImageBook(image,new SimpleDateFormat("ddMMyyyyhhmmssSSS").format(new Date())));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		User user = userRepo.getById((long) book.getUser());
		bfs.setBookuser(user);
		user.getMyBook().add(bfs);
		
		bookRepo.save(bfs);
	}
	
	@PreAuthorize("hasAuthority('SELLER')")
	public void addType(String name) {
		TypeBook newType = new TypeBook();
		newType.setName(name);
		typeBookRepo.save(newType);
	}
	
	@PreAuthorize("hasAuthority('SELLER')")
	public void modifyBook(String id, BookDTO bookModel, MultipartFile file, MultipartFile image) {
		Book bfs = bookRepo.findById(id).get();
		bfs.setAuthor(bookModel.getAuthor());
		bfs.setDescription(bookModel.getDescription());
		bfs.setPublishDate(bfs.getPublishDate());
		bfs.setPublisher(bookModel.getPublisher());
		bfs.setTitle(bookModel.getTitle());
		bfs.setType(bookModel.getTheme());
		if(!file.isEmpty() || file != null) {
			try {
				bfs.setFile(FileConfig.saveFileBook(file, bfs.getFile(),true));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		if(!image.isEmpty() || image != null) {
			try {
				bfs.setImage(FileConfig.modifyImageBook(image,bfs.getImage()));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		bookRepo.save(bfs);
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public void modifyBookFav(String idBook, long idUser, boolean delete) {
		if(delete) {
			User user = userRepo.getById(idUser);
			Book books = bookRepo.getById(idBook);
			
			user.removeFavorite(books);
			
			userRepo.saveAndFlush(user);
		}
		else {
			User user = userRepo.getById(idUser);
			Book books = bookRepo.getById(idBook);
			
			books.addFavorite(user);
			
			bookRepo.saveAndFlush(books);
		}
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public void modifyRekomend(String idBook) {
		Book book = bookRepo.findById(idBook).get();
		book.setRekomended(book.getRekomended()+1);
		bookRepo.save(book);
	}
	
	@PreAuthorize("hasAuthority('SELLER')")
	public void deleteBook(String id) {
		User user = userRepo.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).get();
		Book book = bookRepo.findById(id).get();
		if(user.getMyBook().contains(book)) {
			bookRepo.delete(book);
		}
	}
	
	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
	public void deleteType(String name) {
		typeBookRepo.delete(typeBookRepo.findByName(name));
	}
}
