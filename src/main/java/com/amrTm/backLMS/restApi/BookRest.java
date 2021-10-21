package com.amrTm.backLMS.restApi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	
	@GetMapping("/getbooks")
	public List<BookDTOResp> getBookAll(@RequestParam(required=false) Integer idUs) {
		if(idUs==null) {
			return bookServices.getAllBook();
		}
		else {
			return bookServices.getAllBook(idUs);
		}
	}
	
	@PostMapping("/addbook")
	public String addBook(@RequestBody List<BookDTO> books) {
		bookServices.addBook(books);
		return "Success";
	}
	
	@PostMapping("/rekomendation")
	public String rekomended(@RequestParam String idBook) {
		bookServices.modifyRekomend(idBook);
		return "Success";
	}
	
	@PutMapping("/modifybook/{add}")
	public String modifyBook(@RequestParam(value="idb") String id, 
							  @RequestParam(required=false) int idu,
							  @RequestParam(required=false) boolean del,
							  @RequestBody(required=false) BookDTO book, 
							  @PathVariable(required=false) String add) {
		if(add.equalsIgnoreCase("add")) {
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
}
