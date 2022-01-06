package com.amrTm.backLMS.restApi;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.amrTm.backLMS.DTO.AuthorDTORespFilter;
import com.amrTm.backLMS.DTO.BookDTO;
import com.amrTm.backLMS.DTO.BookDTOResp;
import com.amrTm.backLMS.DTO.BookResponse;
import com.amrTm.backLMS.DTO.PublisherDTORespFilter;
import com.amrTm.backLMS.DTO.TypeDTOResp;
import com.amrTm.backLMS.DTO.TypeResponse;
import com.amrTm.backLMS.service.BookService;

@CrossOrigin
@RestController
@RequestMapping("/book")
public class BookRest {
	@Autowired
	private BookService bookServices;
	
	@GetMapping(path="/image/{path}", produces= {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
	public byte[] getImage(@PathVariable String path, HttpServletResponse res) throws IOException {
		return bookServices.getImageBook(path,res);
	}
	
	@PostMapping(path="/file/{path}")
	public String getfile(@PathVariable String path, @RequestParam String idBook,HttpServletResponse res) throws IOException {
		Resource rsc = bookServices.getFileBook(path,res);
		bookServices.modifyRekomend(idBook, res);
		return Base64.encodeBase64String(rsc.getInputStream().readAllBytes());
//		return ResponseEntity.ok().contentType(MediaType.)
//				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+rsc.getFilename()+"\"").body(rsc);
	}
	
	@GetMapping("/title")
	public List<String> getBookTitle(@RequestParam String words, HttpServletResponse res) throws IOException {
		return bookServices.findAllTitleBook(words, res);
	}
	
	@GetMapping("/author")
	public List<AuthorDTORespFilter> getBookAuthor(@RequestParam String words, HttpServletResponse res) throws IOException {
		return bookServices.findAllAuthor(words, res);
	}
	
	@GetMapping("/publisher")
	public List<PublisherDTORespFilter> getBookPublisher(@RequestParam String words, HttpServletResponse res) throws IOException{
		return bookServices.findAllPublisher(words, res);
	}
	
	@GetMapping("/searchBook")
	public List<String> searchBook(@RequestParam String words, HttpServletResponse res) throws IOException {
		return bookServices.findBookSearch(words, res);
	}
	
	@GetMapping("/searchBookResult")
	public BookResponse searchResult(@RequestParam Integer page, @RequestParam Integer size, @RequestParam() String words, HttpServletResponse res) throws IOException{
		return bookServices.getBookSearch(page, size, words, res);
	}
	
	@GetMapping("/search-MyBook")
	public List<String> searchMyBook(@RequestParam String words, HttpServletResponse res) throws IOException {
		return bookServices.findMyBookSearch(words, res);
	}
	
	@GetMapping("/search-MyBookResult")
	public BookResponse searchResultMyBook(@RequestParam Integer page, @RequestParam Integer size, @RequestParam() String words, HttpServletResponse res) throws IOException{
		return bookServices.getMyBookSearch(page, size, words, res);
	}
	
	@GetMapping("/myBook")
	public BookResponse getMyBook(@RequestParam Integer page, @RequestParam Integer size, HttpServletResponse res) throws IOException{
		return bookServices.getMyBook(page, size, res);
	}
	
	@GetMapping("/bookFavorite")
	public BookResponse getBookFavorite(@RequestParam Integer page, @RequestParam Integer size, HttpServletResponse res) throws IOException{
		return bookServices.getBookFavorite(page, size, res);
	}
	
	@GetMapping("/bookRekommend")
	public List<BookDTOResp> getBookRekommend(HttpServletResponse res) throws IOException{
		return bookServices.getBookRekommend(res);
	}
	
	@GetMapping("/types")
	public List<TypeDTOResp> getTypes(@RequestParam String words, HttpServletResponse res) throws IOException{
		return bookServices.findType(words, res);
	}
	
	@GetMapping("/alltype")
	public TypeResponse getAllTypes(@RequestParam Integer page, @RequestParam Integer size, HttpServletResponse res) throws IOException{
		return bookServices.getAllTheme(size, page, res);
	}
	
	@GetMapping("/getbooksbytype")
	public BookResponse getBooksInType(@RequestParam Integer page, @RequestParam Integer size, @RequestParam Integer theme, HttpServletResponse res) throws IOException{
		return bookServices.getBooksByType(size, page, theme, res);
	}
	
	@GetMapping("/books")
	public BookResponse getBookAll(@RequestParam Integer page, @RequestParam Integer size, HttpServletResponse res) throws IOException {
		return bookServices.getAllBook(page, size, res);
	}
	
	@GetMapping("/filterBookResult")
	public BookResponse filterResult(@RequestParam Integer page, @RequestParam Integer size, @RequestParam(required=false) String title, 
			@RequestParam(required=false) Long idAuthor, @RequestParam(required=false) Long idPublisher, @RequestParam(required=false) List<Integer> idThemes, HttpServletResponse res) throws IOException{
		String words = null;
		if(!title.isBlank()) {words = title;}
		return bookServices.getBookFilter(page, size, words, idAuthor, idPublisher, idThemes, res);
	}
	
	@PostMapping(path="/addbook",consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String addBook(BookDTO books, @RequestPart MultipartFile file, @RequestPart MultipartFile image, HttpServletResponse res) throws IOException {
		bookServices.addBook(books,file,image,res);
		return "Success";
	}
	
	@PutMapping(path="/modifybook/{add}", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String modifyBook(@RequestParam(value="idBook") String id, 
							  @RequestParam(required=false) boolean deleteMode,
							  BookDTO book,
							  @RequestPart(required=false) MultipartFile file,
							  @RequestPart(required=false) MultipartFile image,
							  @PathVariable(required=false) String add,
							  HttpServletResponse res) throws IOException {
		if(add.equalsIgnoreCase("fav")) {
			bookServices.modifyBookFav(id, deleteMode, res);
			return "Success";
		}
		else {
			bookServices.modifyBook(id,book,file,image, res);
			return "Success";
		}
	}
	
	@DeleteMapping("/delete")
	public String deleteBook(@RequestParam String idBook, HttpServletResponse res) throws IOException {
		bookServices.deleteBook(idBook, res);
		return "Success";
	}
	
	@DeleteMapping("/delete/type")
	public String deleteBookType(@RequestParam Integer typeId, HttpServletResponse res) throws IOException {
		bookServices.deleteType(typeId, res);
		return "Success";
	}
}