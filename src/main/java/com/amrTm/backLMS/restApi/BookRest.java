package com.amrTm.backLMS.restApi;

import java.io.IOException;
import java.util.List;

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
	
	@PostMapping(path="/file/{path}")
	public String getfile(@PathVariable String path, @RequestParam String idBook) throws IOException {
		Resource rsc = bookServices.getFileBook(path);
		bookServices.modifyRekomend(idBook);
		return Base64.encodeBase64String(rsc.getInputStream().readAllBytes());
//		return ResponseEntity.ok().contentType(MediaType.)
//				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+rsc.getFilename()+"\"").body(rsc);
	}
	
	@GetMapping("/getMyBook")
	public List<BookDTOResp> getMyBook(@RequestParam int id){
		return bookServices.getMyBook(id);
	}
	
	@GetMapping("/getbooks")
	public List<BookDTOResp> getBookAll() {
		return bookServices.getAllBook();
	}
	
	@GetMapping("/getBooksUser")
	public List<BookDTOResp> getBookAllUser(@RequestParam Integer idUs) {
		return bookServices.getAllBook(idUs);
	}
	
	@GetMapping("/getType")
	public List<String> getTypes(){
		return bookServices.getType();
	}
	
	@PostMapping(path="/addbook",consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String addBook(BookDTO books, @RequestPart(required=false) MultipartFile file, @RequestPart(required=false) MultipartFile image) {
		bookServices.addBook(books,file,image);
		return "Success";
	}
	
	@PostMapping(path="/addTypes",consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String addType(@RequestParam String type) {
		bookServices.addType(type);
		return "Success";
	}
	
	@PutMapping(path="/modifybook/{add}", consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String modifyBook(@RequestParam(value="idb") String id, 
							  @RequestParam(required=false) Integer idu,
							  @RequestParam(required=false) boolean del,
							  BookDTO book,
							  @RequestPart(required=false) MultipartFile file,
							  @RequestPart(required=false) MultipartFile image,
							  @PathVariable(required=false) String add) {
		if(add.equalsIgnoreCase("fav")) {
			bookServices.modifyBookFav(id, idu, del);
			return "Success";
		}
		else {
			bookServices.modifyBook(id,book,file,image);
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
