package com.amrTm.backLMS.restApi;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.amrTm.backLMS.DTO.BookDTO;
import com.amrTm.backLMS.DTO.BookDTOResp;
import com.amrTm.backLMS.service.BookServices;

@CrossOrigin
@RestController
@RequestMapping("/book")
public class BookRest {
	@Autowired
	private BookServices bookServices;
	
	@GetMapping(path="/image/{path}", produces= {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
	public byte[] getImage(@PathVariable String path) throws IOException {
		return bookServices.getImageBook(path);
	}
	
	@GetMapping(path="/file/{path}", produces= {MediaType.APPLICATION_PDF_VALUE})
	public byte[] getfile(@PathVariable String path) throws IOException {
		return bookServices.getFileBook(path);
	}
	
	@GetMapping("/getMyBook")
	public List<BookDTOResp> getMyBook(@RequestParam int id){
		return bookServices.getMyBook(id);
	}
	
	@GetMapping("/getbooks")
	public List<BookDTOResp> getBookAll(@RequestParam(required=false) Integer idUs) {
		if(idUs==null) {
			return bookServices.getAllBook();
		}
		else {
			return bookServices.getAllBook(idUs);
		}
	}
	
	@GetMapping("/getType")
	public List<String> getTypes(){
		return bookServices.getType();
	}
	
	@PostMapping(path="/addbook", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String addBook(@RequestPart List<BookDTO> books) {
		bookServices.addBook(books);
		return "Success";
	}
	
	@PostMapping("/rekomendation")
	public String rekomended(@RequestParam String idBook) {
		bookServices.modifyRekomend(idBook);
		return "Success";
	}
	
	@PostMapping("/addTypes")
	public String addType(@RequestBody String type) {
		bookServices.addType(type);
		return "Success";
	}
	
	@PutMapping(path="/modifybook/{fav}", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String modifyBook(@RequestParam(value="idb") String id, 
							  @RequestParam(required=false) int idu,
							  @RequestParam(required=false) boolean del,
							  @RequestPart(required=false) BookDTO book, 
							  @PathVariable(required=false) String add) {
		if(add.equalsIgnoreCase("fav")) {
			bookServices.modifyBookFav(id, idu, del);
			return "Success";
		}
		else {
			bookServices.modifyBook(id, book);
			return "Success";
		}
	}
	
	@DeleteMapping("/delete")
	public String deleteBook(@RequestParam String id) {
		bookServices.deleteBook(id);
		return "Success";
	}
	
	@DeleteMapping("/delete/type")
	public String deleteBookType(@RequestParam String name) {
		bookServices.deleteType(name);
		return "Success";
	}
}
