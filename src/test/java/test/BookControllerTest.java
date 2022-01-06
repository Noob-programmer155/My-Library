package test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;

import javax.imageio.ImageIO;

import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockPart;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.amrTm.backLMS.LibraryBackendApplication;

import javassist.expr.NewExpr;
import test.configurationFileTest.ObjectBuilder;
import test.configurationFileTest.YamlConfigurationSourceFile;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes=LibraryBackendApplication.class,initializers= {YamlConfigurationSourceFile.class})
@AutoConfigureMockMvc
@SpringBootTest
public class BookControllerTest {
	private final Integer ID = 7;
	private final String USERNAME = "Anggit Wahyu R";
	private final String EMAIL = "rijal.amar30@gmail.com";
	private final String PASSWORD = "Anggit";
	
	@Autowired
	private MockMvc mvc;
	
	@Test
	@WithMockUser(username=EMAIL, password=PASSWORD, authorities= {"SELLER","ADMINISTRATIF"})
	public void bookTest() throws Exception {
//		MockPart title = new MockPart("title","Python For Everything I".getBytes());
//		MockPart author = new MockPart("author",ID.toString().getBytes());
//		MockPart publisher = new MockPart("newPublisher","Amar TM".getBytes());
//		MockPart desc = new MockPart("description","ashdkh shjkhsahudhuias hish uisdu gusdu usduyg usudh uusidhihsih duiudusvu ujhsudv usyud yusgdyu yusd".getBytes());
//		MockPart theme = new MockPart("theme", "117,118".getBytes());
//		MockPart newTheme = new MockPart("newTheme", "Python,Technology".getBytes());
//		URL url = new URL("https://www.freepnglogos.com/uploads/bunga/vektor-bunga-download-vektor-png-gratis-28.png");
//		BufferedImage imageTest = ImageIO.read(url);
//		ByteArrayOutputStream fileTest = new ByteArrayOutputStream();
//		ImageIO.write(imageTest, "png", fileTest);
//		MockMultipartFile image = new MockMultipartFile("image","imageTest.png","image/png", fileTest.toByteArray());
//		MockMultipartFile file = new MockMultipartFile("file","FileTest.pdf","application/pdf", "asjdga asgcubasj uasuahsiu hiuashuiausgcuias".getBytes());
//		
//		mvc.perform(multipart("/book/addbook").file(image).file(file).part(title,author,desc,publisher,theme,newTheme)).andExpect(status().isOk());
		
//		MockMultipartHttpServletRequestBuilder builder = MockMvcRequestBuilders.multipart("/book/modifybook/modify");
//		builder.with(request -> {
//			request.setMethod("PUT");
//			return request;
//		});
//		MockPart title = new MockPart("title","Python For Everyone".getBytes());
//		MockPart publisher = new MockPart("newPublisher","Amar M TM".getBytes());
//		MockPart idBook = new MockPart("idBook","3:PFEI7".getBytes());
//		MockPart desc = new MockPart("description","ashdkh shjkhsahudhuias hish uisdu gusdu usduyg usudh uusidhihsih duiudusvu ujhsudv usyud yusgdyu yusd".getBytes());
//		MockPart theme = new MockPart("theme", "118,128,129".getBytes());
//		MockPart newTheme = new MockPart("newTheme", "Programming Language".getBytes());
//		mvc.perform(builder.file(image).file(file).part(idBook,title,desc,publisher,theme,newTheme)).andExpect(status().isOk())
//		.andDo(print());
//		mvc.perform(get("/book/books").param("page", "0").param("size", "10").param("id", Integer.toString(ID))).andExpect(status().isOk());
//		mvc.perform(get("/book/image/15122021121539952.png")).andExpect(status().isOk());
//		mvc.perform(post("/book/file/15122021121539945.pdf").param("idBook", "1:JFEI7")).andExpect(status().isOk());
//		mvc.perform(get("/book/author").param("exampleWords", "An")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/publisher").param("exampleWords", "An")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/myBook").param("page", "0").param("size", "10")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/bookFavorite").param("page", "0").param("size", "10")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/bookRekommend")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/types").param("exampleWords", "Pro")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/findBook").param("exampleWords", "Java")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/searchBookResult").param("page", "0").param("size", "10").param("suggestionWords", "Java"))
//		.andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/books").param("page", "0").param("size", "10")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/filterBookResult").param("page", "0").param("size", "10").param("title", "Java For Everything I")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/filterBookResult").param("page", "0").param("size", "10").param("title", "Java For Everything I")
//				.param("idAuthor", "7")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(get("/book/filterBookResult").param("page", "0").param("size", "10").param("title", "Java For Everything II")
//				.param("idAuthor", "7").param("idPublisher", "116")).andExpect(status().isOk()).andDo(print());
//		MockMultipartHttpServletRequestBuilder builder2 = MockMvcRequestBuilders.multipart("/book/modifybook/fav");
//		builder2.with(request -> {
//			request.setMethod("PUT");
//			return request;
//		});
//		MockPart idBook = new MockPart("idBook","3:PFEI7".getBytes());
//		MockPart Fav = new MockPart("deleteMode","false".getBytes());
//		MockPart notFav = new MockPart("deleteMode","true".getBytes());
//		mvc.perform(builder2.part(idBook,Fav)).andExpect(status().isOk()).andDo(print());
//		mvc.perform(builder2.part(idBook,notFav)).andExpect(status().isOk()).andDo(print());
//		mvc.perform(delete("/book/delete").param("idBook", "2:JFEI7")).andExpect(status().isOk()).andDo(print());
//		mvc.perform(delete("/book/delete/type").param("typeId", "137")).andExpect(status().isOk()).andDo(print());
	}
	
	@Test
	public void testApiWithNoAuth() throws Exception {
		mvc.perform(get("/book/bookRekommend")).andExpect(status().isOk()).andDo(print());
		mvc.perform(get("/book/searchBookResult").param("page", "0").param("size", "10").param("suggestionWords", "Java"))
		.andExpect(status().isOk()).andDo(print());
		mvc.perform(get("/book/books").param("page", "0").param("size", "10")).andExpect(status().isOk()).andDo(print());
		mvc.perform(get("/book/filterBookResult").param("page", "0").param("size", "10").param("title", "Java For Everything II")
				.param("idAuthor", "7").param("idPublisher", "116")).andExpect(status().isOk()).andDo(print());
	}
}
