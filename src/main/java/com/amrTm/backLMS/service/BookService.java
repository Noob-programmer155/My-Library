package com.amrTm.backLMS.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.amrTm.backLMS.DTO.AuthorDTORespFilter;
import com.amrTm.backLMS.DTO.BookDTO;
import com.amrTm.backLMS.DTO.BookDTOResp;
import com.amrTm.backLMS.DTO.BookResponse;
import com.amrTm.backLMS.DTO.PublisherDTOResp;
import com.amrTm.backLMS.DTO.TypeDTOResp;
import com.amrTm.backLMS.DTO.TypeResponse;
import com.amrTm.backLMS.configuration.FileConfig;
import com.amrTm.backLMS.entity.Book;
import com.amrTm.backLMS.entity.BookReport;
import com.amrTm.backLMS.entity.Publisher;
import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.StatusReport;
import com.amrTm.backLMS.entity.TypeBook;
import com.amrTm.backLMS.entity.User;
import com.amrTm.backLMS.repository.BookRepo;
import com.amrTm.backLMS.repository.BookReportRepo;
import com.amrTm.backLMS.repository.PublisherRepo;
import com.amrTm.backLMS.repository.TypeBookRepo;
import com.amrTm.backLMS.repository.UserRepo;
import com.amrTm.backLMS.repository.implClass.BookRepoFilerImpl;

@Service
public class BookService {
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private BookRepo bookRepo;
	@Autowired
	private TypeBookRepo typeBookRepo;
	@Autowired
	private PublisherRepo publisherRepo;
	@Autowired
	private BookReportRepo bookReportRepo;
	@Autowired
	private BookRepoFilerImpl bookRepoFilerImpl;
	@Autowired
	private FileConfig fileConfig;
	@Value("${filestorage}")
	private String storage;
	
	public byte[] getImageBook(String path, HttpServletResponse res) throws IOException {
		try {
			FileInputStream resource = new FileInputStream(storage+"/image/book/"+path);
			return resource.readAllBytes();
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public byte[] getFileBook(String path, HttpServletResponse res) throws IOException {
		try {
			FileInputStream resource = new FileInputStream(storage+"/file/"+path);
			return resource.readAllBytes();
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	public TypeResponse getAllTheme(int size, int page, HttpServletResponse res) throws IOException{
		try {
			Pageable data = PageRequest.of(page, size, Sort.by("name").ascending());
			Page<TypeBook> typeData = typeBookRepo.findAllDistinctByBookTypeNotEmpty(data);
			TypeResponse response = new TypeResponse();
			response.setData(typeData.getContent().stream().map(item -> {
				TypeDTOResp type = new TypeDTOResp();
				type.setId(item.getId());
				type.setName(item.getName());
				return type;
			}).collect(Collectors.toList()));
			response.setSizeAllPage(typeData.getTotalPages());
			return response;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	private long IdUserBT = -1;
	public BookResponse getBooksByType(int size, int page, int type, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null) {
				try {
					
					User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
					IdUserBT = user.getId();
				}catch(NoSuchElementException e) {
					IdUserBT = -1;
				}
			}
			else {
				IdUserBT = -1;
			}
			Pageable data = PageRequest.of(page, size, Sort.by("title"));
			Page<Book> bookData = bookRepo.findAllByTypeBooksId(type, data);
			BookResponse response = new BookResponse();
			response.setData(bookData.getContent().stream().map(item -> {
				BookDTOResp book = new BookDTOResp();
				book.setId(item.getId());
				book.setAuthor(item.getBookUser().getName());
				book.setFavorite(item.getBookFavorite().stream().anyMatch(usr -> usr.getId() == IdUserBT));
				book.setDescription(item.getDescription());
				book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(item.getPublishDate()));
				book.setPublisher(new PublisherDTOResp(item.getPublisherBook().getId(),item.getPublisherBook().getName()));
				if(item.getBookUser()!=null)
					book.setStatus(item.getBookUser().getId() == IdUserBT);
				else
					book.setStatus(false);
				book.setTheme(item.getTypeBooks().stream().map(sa -> {
					TypeDTOResp typeData = new TypeDTOResp();
					typeData.setId(sa.getId());
					typeData.setName(sa.getName());
					return typeData;}).collect(Collectors.toList()));
				book.setFile(item.getFile());
				book.setImage(item.getImage());
				book.setTitle(item.getTitle());
				return book;
			}).collect(Collectors.toList()));
			response.setSizeAllPage(bookData.getTotalPages());
			return response;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	public List<String> findBookSearch(String word, HttpServletResponse res) throws IOException{
		try {
			Pageable data = PageRequest.of(0, 10);
			List<String> dataRes = new ArrayList<>();
			bookRepo.findDistinctByTitleContainsOrBookUserNameContainsOrPublisherBookNameContains(word, word, word, data).getContent().stream()
					.forEach(a -> {
						if(dataRes.size() <= 10) {
							if(a.getTitle().contains(word)&&!dataRes.contains(a.getTitle())) dataRes.add(a.getTitle());
							if(a.getBookUser().getName().contains(word)&&!dataRes.contains(a.getBookUser().getName())) dataRes.add(a.getBookUser().getName());
							if(a.getPublisherBook().getName().contains(word)&&!dataRes.contains(a.getPublisherBook().getName())) dataRes.add(a.getPublisherBook().getName());
						}
					});
			return dataRes;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	@PreAuthorize("hasAuthority('SELLER')")
	public List<String> findMyBookSearch(String word, HttpServletResponse res) throws IOException{
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
			Pageable data = PageRequest.of(0, 10);
			List<String> dataRes = new ArrayList<>();
			bookRepo.findAllBookUser(word, word, user.getId(), data).getContent().stream()
					.forEach(a -> {
						if(dataRes.size() <= 10) {
							if(a.getTitle().contains(word)&&!dataRes.contains(a.getTitle())) dataRes.add(a.getTitle());
							if(a.getPublisherBook().getName().contains(word)&&!dataRes.contains(a.getPublisherBook().getName())) dataRes.add(a.getPublisherBook().getName());
						}
					});
			return dataRes;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	public List<String> findAllTitleBook(String words, HttpServletResponse res) throws IOException{
		try {
			Pageable data = PageRequest.of(0, 10);
			return bookRepo.findAllByTitleContains(words, data).getContent().stream().map(a -> {
				return a.getTitle();
			}).collect(Collectors.toList());
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	} 
	
	public List<AuthorDTORespFilter> findAllAuthor(String words, HttpServletResponse res) throws IOException{
		try {
			Pageable data = PageRequest.of(0, 10);
			return userRepo.findAllByNameContainsAndRole(words, Role.SELLER, data).getContent().stream().map(a -> {
				AuthorDTORespFilter author = new AuthorDTORespFilter();
				author.setId(a.getId());
				author.setName(a.getName());
				return author;
			}).collect(Collectors.toList());
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	public List<PublisherDTOResp> findAllPublisher(String words, HttpServletResponse res) throws IOException{
		try {
			Pageable data = PageRequest.of(0, 10);
			return publisherRepo.findAllByNameContains(words, data).getContent().stream().map(a -> {
				PublisherDTOResp publisher = new PublisherDTOResp();
				publisher.setId(a.getId());
				publisher.setName(a.getName());
				return publisher;
			}).collect(Collectors.toList());
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	private long IdUserBR = -1;
	public List<BookDTOResp> getBookRekommend(HttpServletResponse res) throws IOException{
//		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null && auth.getPrincipal() instanceof User) {
				try {
					User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
					IdUserBR = user.getId();
				}catch(NoSuchElementException e) {
					IdUserBR = -1;
				}
			}
			else {
				IdUserBR = -1;
			}
			Pageable data = PageRequest.of(0, 10, Sort.by(Direction.DESC, "rekomended"));
			return bookRepo.findAll(data).getContent().stream().map(a -> {
				BookDTOResp book = new BookDTOResp();
				book.setId(a.getId());
				book.setAuthor(a.getBookUser().getName());
				book.setFavorite(a.getBookFavorite().stream().anyMatch(g -> g.getId() == IdUserBR));
				book.setDescription(a.getDescription());
				book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(a.getPublishDate()));
				book.setPublisher(new PublisherDTOResp(a.getPublisherBook().getId(),a.getPublisherBook().getName()));
				if(a.getBookUser()!=null)
					book.setStatus(a.getBookUser().getId() == IdUserBR);
				else
					book.setStatus(false);
				book.setTheme(a.getTypeBooks().stream().map(sa -> {
					TypeDTOResp typeData = new TypeDTOResp();
					typeData.setId(sa.getId());
					typeData.setName(sa.getName());
					return typeData;}).collect(Collectors.toList()));
				book.setFile(a.getFile());
				book.setImage(a.getImage());
				book.setTitle(a.getTitle());
				return book;
			}).collect(Collectors.toList());
//		}catch(Exception e) {
//			res.sendError(500, "There`s some error when fetching data");
//			return null;
//		}
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	public BookResponse getBookFavorite(int page, int size, HttpServletResponse res) throws IOException{
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null) {
				User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
				Pageable data = PageRequest.of(page, size, Sort.by("title"));
				Page<Book> dataBook = bookRepo.findAllByBookFavoriteId(user.getId(), data);
				List<BookDTOResp> bookResponseData = dataBook.getContent().stream().map(a -> {
					BookDTOResp book = new BookDTOResp();
					book.setId(a.getId());
					book.setAuthor(a.getBookUser().getName());
					book.setFavorite(true);
					book.setDescription(a.getDescription());
					book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(a.getPublishDate()));
					book.setPublisher(new PublisherDTOResp(a.getPublisherBook().getId(),a.getPublisherBook().getName()));
					if(a.getBookUser()!=null)
						book.setStatus(a.getBookUser().getId() == user.getId());
					else
						book.setStatus(false);
					book.setTheme(a.getTypeBooks().stream().map(sa -> {
						TypeDTOResp typeData = new TypeDTOResp();
						typeData.setId(sa.getId());
						typeData.setName(sa.getName());
						return typeData;}).collect(Collectors.toList()));
					book.setFile(a.getFile());
					book.setImage(a.getImage());
					book.setTitle(a.getTitle());
					return book;
				}).collect(Collectors.toList());
				BookResponse response = new BookResponse();
				response.setData(bookResponseData);
				response.setSizeAllPage(dataBook.getTotalPages());
				return response;
			}
			return null;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}

	@PreAuthorize("hasAuthority('SELLER')")
	public BookResponse getMyBook(int page, int size, HttpServletResponse res) throws IOException {
//		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null) {
				User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
				Pageable data = PageRequest.of(page, size, Sort.by("title"));
				Page<Book> dataBook = bookRepo.findAllByBookUserId(user.getId(), data);
				List<BookDTOResp> bookResponseData = dataBook.getContent().stream().map(a -> {
					BookDTOResp book = new BookDTOResp();
					book.setId(a.getId());
					book.setAuthor(a.getBookUser().getName());
					book.setFavorite(a.getBookFavorite().stream().anyMatch(userItem -> userItem.getId() == user.getId()));
					book.setDescription(a.getDescription());
					book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(a.getPublishDate()));
					book.setPublisher(new PublisherDTOResp(a.getPublisherBook().getId(),a.getPublisherBook().getName()));
					book.setStatus(true);
					book.setTheme(a.getTypeBooks().stream().map(sa -> {
						TypeDTOResp typeData = new TypeDTOResp();
						typeData.setId(sa.getId());
						typeData.setName(sa.getName());
						return typeData;}).collect(Collectors.toList()));
					book.setFile(a.getFile());
					book.setImage(a.getImage());
					book.setTitle(a.getTitle());
					return book;
				}).collect(Collectors.toList());
				BookResponse response = new BookResponse();
				response.setData(bookResponseData);
				response.setSizeAllPage(dataBook.getTotalPages());
				return response;
			}
			return null;
//		}catch(Exception e) {
//			res.sendError(500, "There`s some error when fetching data");
//			return null;
//		}
	}

	@PreAuthorize("hasAuthority('SELLER')")
	public BookDTOResp getOneMyBook(String title, String publisher, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null) {
				User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
				try {
					BookDTOResp dataBook = bookRepo.findOneByBookUserIdAndTitleAndPublisherBookName(user.getId(), title, publisher).map(item -> {
						BookDTOResp resBook = new BookDTOResp();
						resBook.setId(item.getId());
						resBook.setAuthor(item.getBookUser().getName());
						resBook.setFavorite(item.getBookFavorite().stream().anyMatch(g -> g.getId() == IdUserAB));
						resBook.setDescription(item.getDescription());
						resBook.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(item.getPublishDate()));
						resBook.setPublisher(new PublisherDTOResp(item.getPublisherBook().getId(),item.getPublisherBook().getName()));
						resBook.setStatus(true);
						resBook.setTheme(item.getTypeBooks().stream().map(sa -> {
							TypeDTOResp typeData = new TypeDTOResp();
							typeData.setId(sa.getId());
							typeData.setName(sa.getName());
							return typeData;}).collect(Collectors.toList()));
						resBook.setFile(item.getFile());
						resBook.setImage(item.getImage());
						resBook.setTitle(item.getTitle());
						return resBook;
					}).get();
					return dataBook;
				}catch(NoSuchElementException e) {
					res.sendError(400, "Data Not Found !!!");
				}
			}
			return null;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	private long IdUserAB = -1;
	public BookResponse getAllBook(int page, int size, HttpServletResponse res) throws IOException {
//		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null && auth.getPrincipal() instanceof User) {
				try {
					User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
					IdUserAB = user.getId();
				}catch(NoSuchElementException e) {
					IdUserAB = -1;
				}
			}
			else {
				IdUserAB = -1;
			}
			Pageable data = PageRequest.of(page, size, Sort.by("title"));
			Page<Book> dataBook = bookRepo.findAll(data);
			List<BookDTOResp> bookResponseData = dataBook.getContent().stream().map(a -> {
				BookDTOResp book = new BookDTOResp();
				book.setId(a.getId());
				book.setAuthor(a.getBookUser().getName());
				book.setFavorite(a.getBookFavorite().stream().anyMatch(g -> g.getId() == IdUserAB));
				book.setDescription(a.getDescription());
				book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(a.getPublishDate()));
				book.setPublisher(new PublisherDTOResp(a.getPublisherBook().getId(),a.getPublisherBook().getName()));
				if(a.getBookUser()!=null)
					book.setStatus(a.getBookUser().getId() == IdUserAB);
				else
					book.setStatus(false);
				book.setTheme(a.getTypeBooks().stream().map(sa -> {
					TypeDTOResp typeData = new TypeDTOResp();
					typeData.setId(sa.getId());
					typeData.setName(sa.getName());
					return typeData;}).collect(Collectors.toList()));
				book.setFile(a.getFile());
				book.setImage(a.getImage());
				book.setTitle(a.getTitle());
				return book;
			}).collect(Collectors.toList());
			BookResponse response = new BookResponse();
			response.setData(bookResponseData);
			response.setSizeAllPage(dataBook.getTotalPages());
			return response;
//		}catch(Exception e) {
//			res.sendError(500, "There`s some error when fetching data");
//			return null;
//		}
	}
	
	private long IdUserBF = -1;
	public BookResponse getBookFilter(int page, int size, String title, Long idUser, Long idPublisher, List<Integer> idTypes, HttpServletResponse res) throws IOException{
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null) {
				try {
					User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
					IdUserBF = user.getId();
				}catch(NoSuchElementException e) {
					IdUserBF = -1;
				}
			}
			else {
				IdUserBF = -1;
			}
			PagedListHolder<Book> dataBook = bookRepoFilerImpl.FilterBook(title, idUser, idPublisher, idTypes, page, size);
			List<BookDTOResp> bookResponseData = dataBook.getPageList().stream().map(a -> {
				BookDTOResp book = new BookDTOResp();
				book.setId(a.getId());
				book.setAuthor(a.getBookUser().getName());
				book.setFavorite(a.getBookFavorite().stream().anyMatch(g -> g.getId() == IdUserBF));
				book.setDescription(a.getDescription());
				book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(a.getPublishDate()));
				book.setPublisher(new PublisherDTOResp(a.getPublisherBook().getId(),a.getPublisherBook().getName()));
				if(a.getBookUser()!=null)
					book.setStatus(a.getBookUser().getId() == IdUserBF);
				else
					book.setStatus(false);
				book.setTheme(a.getTypeBooks().stream().map(sa -> {
					TypeDTOResp typeData = new TypeDTOResp();
					typeData.setId(sa.getId());
					typeData.setName(sa.getName());
					return typeData;}).collect(Collectors.toList()));
				book.setFile(a.getFile());
				book.setImage(a.getImage());
				book.setTitle(a.getTitle());
				return book;
			}).collect(Collectors.toList());
			BookResponse response = new BookResponse();
			response.setData(bookResponseData);
			response.setSizeAllPage(dataBook.getPageCount());
			return response;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	private long IdUserBS = -1;
	public BookResponse getBookSearch(int page, int size, String exampleWords, HttpServletResponse res) throws IOException{
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if(auth != null) {
				try {
					User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
					IdUserBS = user.getId();
				}catch(NoSuchElementException e) {
					IdUserBS = -1;
				}
			}
			else {
				IdUserBS = -1;
			}
			Pageable data = PageRequest.of(page, size, Sort.by("title"));
			Page<Book> dataBook = bookRepo.findDistinctByTitleContainsOrBookUserNameContainsOrPublisherBookNameContains(exampleWords, exampleWords, exampleWords, data);
			List<BookDTOResp> bookResponseData = dataBook.getContent().stream().map(a -> {
				BookDTOResp book = new BookDTOResp();
				book.setId(a.getId());
				book.setAuthor(a.getBookUser().getName());
				book.setFavorite(a.getBookFavorite().stream().anyMatch(g -> g.getId() == IdUserBS));
				book.setDescription(a.getDescription());
				book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(a.getPublishDate()));
				book.setPublisher(new PublisherDTOResp(a.getPublisherBook().getId(),a.getPublisherBook().getName()));
				if(a.getBookUser()!=null)
					book.setStatus(a.getBookUser().getId() == IdUserBS);
				else
					book.setStatus(false);
				book.setTheme(a.getTypeBooks().stream().map(sa -> {
					TypeDTOResp typeData = new TypeDTOResp();
					typeData.setId(sa.getId());
					typeData.setName(sa.getName());
					return typeData;}).collect(Collectors.toList()));
				book.setFile(a.getFile());
				book.setImage(a.getImage());
				book.setTitle(a.getTitle());
				return book;
			}).collect(Collectors.toList());
			BookResponse response = new BookResponse();
			response.setData(bookResponseData);
			response.setSizeAllPage(dataBook.getTotalPages());
			return response;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	@PreAuthorize("hasAuthority('SELLER')")
	public BookResponse getMyBookSearch(int page, int size, String exampleWords, HttpServletResponse res) throws IOException{
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
			Pageable data = PageRequest.of(page, size, Sort.by("title"));
			Page<Book> dataBook = bookRepo.findAllBookUser(exampleWords, exampleWords, user.getId(), data);
			List<BookDTOResp> bookResponseData = dataBook.getContent().stream().map(a -> {
				BookDTOResp book = new BookDTOResp();
				book.setId(a.getId());
				book.setAuthor(a.getBookUser().getName());
				book.setFavorite(a.getBookFavorite().stream().anyMatch(userItem -> userItem.getId() == user.getId()));
				book.setDescription(a.getDescription());
				book.setPublishDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(a.getPublishDate()));
				book.setPublisher(new PublisherDTOResp(a.getPublisherBook().getId(),a.getPublisherBook().getName()));
				book.setStatus(true);
				book.setTheme(a.getTypeBooks().stream().map(sa -> {
					TypeDTOResp typeData = new TypeDTOResp();
					typeData.setId(sa.getId());
					typeData.setName(sa.getName());
					return typeData;}).collect(Collectors.toList()));
				book.setFile(a.getFile());
				book.setImage(a.getImage());
				book.setTitle(a.getTitle());
				return book;
			}).collect(Collectors.toList());
			BookResponse response = new BookResponse();
			response.setData(bookResponseData);
			response.setSizeAllPage(dataBook.getTotalPages());
			return response;
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}
	
	public List<TypeDTOResp> findType(String word, HttpServletResponse res) throws IOException{
		try {
			Pageable data = PageRequest.of(0, 10);
			return typeBookRepo.findAllByNameContains(word, data).getContent().stream().map(a -> {
				TypeDTOResp type = new TypeDTOResp();
				type.setId(a.getId());
				type.setName(a.getName());
				return type;
			}).collect(Collectors.toList());
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
			return null;
		}
	}

	Logger log = Logger.getGlobal();
	@PreAuthorize("hasAuthority('SELLER')")
	@Transactional(isolation=Isolation.REPEATABLE_READ)
	public void addBook(BookDTO book, MultipartFile file, MultipartFile image, HttpServletResponse res) throws IOException {
//		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
			StringBuffer sb = new StringBuffer();
			int c = (int)bookRepo.count();
			sb.append(c+1+":");
			String[] sa1 = book.getTitle().split(" ");
			for (String d : sa1) {sb.append(d.charAt(0));}
			sb.append(String.valueOf(user.getId()));
			Book bfs = new Book();
			bfs.setId(sb.toString());
			bfs.setDescription(book.getDescription());
			bfs.setPublishDate(new Date());
			bfs.setRekomended(0);
			bfs.setTitle(book.getTitle());
			bfs.setFile(fileConfig.saveFileBook(file, new SimpleDateFormat("ddMMyyyyhhmmssSSS").format(new Date()),false));
			bfs.setImage(fileConfig.saveImageBook(image,new SimpleDateFormat("ddMMyyyyhhmmssSSS").format(new Date())));
			bfs.setBookUser(user);
			user.getMyBook().add(bfs);
			Publisher publisher = null;
			if(book.getPublisher() != null) {
				publisher = publisherRepo.findById((long)book.getPublisher()).get();
			}
			else {
				if(book.getNewPublisher() != null) {
					Publisher pub = new Publisher();
					pub.setName(book.getNewPublisher());
					publisher = publisherRepo.save(pub);
				}
				else {
					throw new IOException("Request Attribut not permitted !!!");
				}
			}
			bfs.setPublisherBook(publisher);
			publisher.getBooks().add(bfs);

			Book newBook = bookRepo.saveAndFlush(bfs);
			if(book.getTheme() != null) {
				if(!book.getTheme().isEmpty()) {
					typeBookRepo.findAllById(book.getTheme()).forEach(data-> {
						data.addBook(newBook);
						typeBookRepo.save(data);
					});
				}
			}
			if(book.getNewTheme() != null) {
				if(!book.getNewTheme().isEmpty()) {
					book.getNewTheme().forEach(se -> {
						TypeBook tb = new TypeBook();
						tb.setName(se);
						TypeBook typeBook = typeBookRepo.save(tb);
						typeBook.addBook(newBook);
						typeBookRepo.save(typeBook);
					});
				}
				else {
					throw new IOException("Request Attribut not permitted !!!");
				}
			}

			BookReport br = new BookReport();
			br.setIdBook(newBook.getId());
			br.setTitleBook(newBook.getTitle());
			br.setIdAuthor(newBook.getBookUser().getId());
			br.setNameAuthor(newBook.getBookUser().getName());
			br.setEmailAuthor(newBook.getBookUser().getEmail());
			br.setIdPublisher(newBook.getPublisherBook().getId());
			br.setNamePublisher(newBook.getPublisherBook().getName());
			br.setIdUser(user.getId());
			br.setUsername(user.getName());
			br.setEmail(user.getEmail());
			br.setStatusReport(StatusReport.ADD);
			br.setDateReport(new Date());
			bookReportRepo.save(br);
//		} catch (IOException e) {
//			res.sendError(400, "All field`s must be filled including image and file field");
//		}
//		catch(Exception e) {
//			res.sendError(500, "There`s some error when fetching data");
//		}
	}
	
	private Publisher publisherModify = null;
	@PreAuthorize("hasAuthority('SELLER')")
	@Transactional(isolation=Isolation.REPEATABLE_READ)
	public void modifyBook(String id, BookDTO bookModel, MultipartFile file, MultipartFile image, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			Book bfs = bookRepo.findById(id).get();
			User usr = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
			if(bfs.getBookUser().getId() == usr.getId()) {
				bfs.setDescription(bookModel.getDescription());
				bfs.setPublishDate(bfs.getPublishDate());
				bfs.setTitle(bookModel.getTitle());
				if(file != null) {
					bfs.setFile(fileConfig.saveFileBook(file, bfs.getFile(),true));
				}
				if(image != null) {
					bfs.setImage(fileConfig.modifyImageBook(image,bfs.getImage()));
				}
				
				if(bookModel.getPublisher() != null) {
					publisherModify = publisherRepo.findById((long)bookModel.getPublisher()).get();
				}
				else {
					if(bookModel.getNewPublisher() != null) {
						publisherRepo.findByName(bookModel.getNewPublisher()).ifPresentOrElse(a -> publisherModify = a, () -> {Publisher pub = new Publisher();
						pub.setName(bookModel.getNewPublisher());
						publisherModify = publisherRepo.save(pub);});
					}
					else {
						throw new IOException("Request Attribut not permitted !!!");
					}
				}
				bfs.setPublisherBook(publisherModify);
				publisherModify.getBooks().add(bfs);
				
				Book bookModify = bookRepo.save(bfs);
				
				bookModify.getTypeBooks().forEach(data -> {
					data.removeBook(bookModify);
					typeBookRepo.save(data);
				});
				
				if(bookModel.getTheme() != null) {
					if(!bookModel.getTheme().isEmpty()) {
						typeBookRepo.findAllById(bookModel.getTheme()).forEach(dataItem -> {
							dataItem.addBook(bookModify);
							typeBookRepo.save(dataItem);
						});
					}
				}
				if(bookModel.getNewTheme() != null) {
					if(!bookModel.getNewTheme().isEmpty()) {
						bookModel.getNewTheme().forEach(se -> {
							TypeBook tb = new TypeBook();
							tb.setName(se);
							tb.addBook(bookModify);
							typeBookRepo.save(tb);
						});
					}
				}
			}
			else {res.sendError(403, "User not allowed to access this API !!!");}
		} catch (Exception e) {
			res.sendError(500, "There`s some error when fetching data");
		} 
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	@Transactional(isolation=Isolation.REPEATABLE_READ)
	public void modifyBookFav(String idBook, boolean delete, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
			Book books = bookRepo.findById(idBook).get();
			if(delete) {
				books.removeFavorite(user);
				userRepo.save(user);
			}
			else {
				user.addFavorite(books);
				bookRepo.save(books);
			}
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
		}
	}
	
	@PreAuthorize("hasAnyAuthority('USER','SELLER','ADMINISTRATIF','MANAGER')")
	@Transactional(isolation=Isolation.REPEATABLE_READ)
	public void modifyRekomend(String idBook, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User usr = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
			Book book = bookRepo.findById(idBook).get();
			book.setRekomended(book.getRekomended()+1);
			Book newBook = bookRepo.save(book);
			
			BookReport br = new BookReport();
			br.setIdBook(newBook.getId());
			br.setTitleBook(newBook.getTitle());
			br.setIdAuthor(newBook.getBookUser().getId());
			br.setNameAuthor(newBook.getBookUser().getName());
			br.setEmailAuthor(newBook.getBookUser().getEmail());
			br.setIdPublisher(newBook.getPublisherBook().getId());
			br.setNamePublisher(newBook.getPublisherBook().getName());
			br.setIdUser(usr.getId());
			br.setUsername(usr.getName());
			br.setEmail(usr.getEmail());
			br.setStatusReport(StatusReport.DOWNLOAD);
			br.setDateReport(new Date());
			bookReportRepo.save(br);
		}catch(NoSuchElementException e) {
			res.sendError(400, "This book cannot found in the library");
		}catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
		}
	}
	
	@PreAuthorize("hasAuthority('SELLER')")
	@Transactional(isolation=Isolation.REPEATABLE_READ)
	public void deleteBook(String id, HttpServletResponse res) throws IOException {
		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepo.findByEmail(((User)auth.getPrincipal()).getEmail()).get();
			Book book = bookRepo.findById(id).get();
			if(user.getMyBook().contains(book)) {
				String idBook = book.getId();
				String titleBook = book.getTitle();
				long idAuthor = book.getBookUser().getId();
				String nameAuthor = book.getBookUser().getName();
				String emailAuthor = book.getBookUser().getEmail();
				long idPublisher = book.getPublisherBook().getId();
				String namePublisher = book.getPublisherBook().getName();

				fileConfig.deleteBooksFile(book.getFile());
				fileConfig.deleteBooksImage(book.getImage());
				book.getTypeBooks().forEach(re -> {
					re.removeBook(book);
				});
				bookRepo.delete(book);
		
				BookReport br = new BookReport();
				br.setIdBook(idBook);
				br.setTitleBook(titleBook);
				br.setIdAuthor(idAuthor);
				br.setNameAuthor(nameAuthor);
				br.setEmailAuthor(emailAuthor);
				br.setIdPublisher(idPublisher);
				br.setNamePublisher(namePublisher);
				br.setIdUser(user.getId());
				br.setUsername(user.getName());
				br.setEmail(user.getEmail());
				br.setStatusReport(StatusReport.DELETE);
				br.setDateReport(new Date());
				bookReportRepo.save(br);
			}else {
				res.sendError(400, "Bad Request");
			}
		}catch(AuthenticationException e) {
			res.sendError(401, "Invalid credential`s, please check your credential");
		}
		catch(Exception e) {
			res.sendError(500, "There`s some error when fetching data");
		}
	}
	
//	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
//	@Transactional(isolation=Isolation.REPEATABLE_READ)
//	public void deleteType(Integer type, HttpServletResponse res) throws IOException {
//		try {
//			User user = userRepo.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).get();
//			TypeBook tb = typeBookRepo.findById(type).get();
//			String nameTb = tb.getName();
//			typeBookRepo.delete(tb);
//			
//			BookReport br = new BookReport();
//			br.setIdBook(String.valueOf(type));
//			br.setTitleBook(nameTb);
//			br.setIdAuthor(null);
//			br.setNameAuthor("");
//			br.setEmailAuthor("");
//			br.setIdPublisher(null);
//			br.setNamePublisher("");
//			br.setIdUser(user.getId());
//			br.setUsername(user.getName());
//			br.setEmail(user.getEmail());
//			br.setStatusReport(StatusReport.DELETE_TYPE);
//			br.setDateReport(new Date());
//			bookReportRepo.save(br);
//		}catch(Exception e) {
//			res.sendError(500, "There`s some error when fetching data");
//		}
//	}
	
//	@PreAuthorize("hasAnyAuthority('ADMINISTRATIF','MANAGER')")
//	public void deletePublisher(Integer name) {
//		publisherRepo.deleteById((long)name);
//	}
}
