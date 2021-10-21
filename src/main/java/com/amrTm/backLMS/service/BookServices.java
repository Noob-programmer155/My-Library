package com.amrTm.backLMS.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.amrTm.backLMS.DTO.BookDTO;
import com.amrTm.backLMS.DTO.BookDTOResp;
import com.amrTm.backLMS.entity.Book;
import com.amrTm.backLMS.entity.BookTheme;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.repository.BookRepo;
import com.amrTm.backLMS.repository.UserRepo;

@Service
public class BookServices {
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private BookRepo bookRepo;
	
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
			book.setTheme(a.getTheme().toString());
			book.setData(null);
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
			book.setTheme(a.getTheme().toString());
			book.setData(a.getData());
			book.setImage(a.getImage());
			book.setTitle(a.getTitle());
			return book;
		}).collect(Collectors.toList());
	}
	
	@PreAuthorize("hasAuthority('SELLER')")
	public void addBook(List<BookDTO> book) {
		book.forEach(bookModel -> {
			StringBuffer sb = new StringBuffer();
			int c = (int)bookRepo.count();
			sb.append(c+1+":");
			String[] sa = bookModel.getTheme().split(" ");
			for (String d : sa) {sb.append(d.charAt(0));}
			String[] sa1 = bookModel.getTitle().split(" ");
			for (String d : sa1) {sb.append(d.charAt(0));}
			String[] sa2 = bookModel.getAuthor().split(" ");
			for (String d : sa2) {sb.append(d.charAt(0));}
			Book bfs = new Book();
			bfs.setId(sb.toString());
			bfs.setAuthor(bookModel.getAuthor());
			bfs.setDescription(bookModel.getDescription());
			try {
				bfs.setPublishDate(new SimpleDateFormat("yyyy-MM-ddTHH:mm").parse(bookModel.getPublishDate()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			bfs.setPublisher(bookModel.getPublisher());
			bfs.setTheme(BookTheme.valueOf(bookModel.getTheme()));
			bfs.setRekomended(0);
			bfs.setTitle(bookModel.getTitle());
			bfs.setData(bookModel.getData());
			bfs.setImage(bookModel.getImage());
			
			User user = userRepo.getById((long) bookModel.getUser());
			bfs.setBookuser(user);
			user.getMyBook().add(bfs);
			
			bookRepo.save(bfs);
		});
	}
	
	@PreAuthorize("hasAuthority('SELLER')")
	public void modifyBook(String id, BookDTO bookModel) {
		Book bfs = bookRepo.findById(id).get();
		bfs.setAuthor(bookModel.getAuthor());
		bfs.setDescription(bookModel.getDescription());
		try {
			bfs.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(bookModel.getPublishDate()));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		bfs.setPublisher(bookModel.getPublisher());
		bfs.setTheme(BookTheme.valueOf(bookModel.getTheme()));
		bfs.setTitle(bookModel.getTitle());
		bfs.setData(bookModel.getData());
		bfs.setImage(bookModel.getImage());
		
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
		bookRepo.delete(bookRepo.findById(id).get());
	}
}
