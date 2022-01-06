package test;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.util.Base64;

import javax.imageio.ImageIO;

import org.hamcrest.core.IsNull;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockPart;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.amrTm.backLMS.LibraryBackendApplication;
import test.configurationFileTest.YamlConfigurationSourceFile;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes=LibraryBackendApplication.class,initializers= {YamlConfigurationSourceFile.class})
@AutoConfigureMockMvc
@SpringBootTest
public class UserControllerTest {
	private final long ID = 1l;
	private final String USERNAME = "<your name auth>";
	private final String EMAIL = "<your email auth>";
	private final String PASSWORD = "<password auth>";
	private final String NEWUSERNAME = "<your name auth, for modify user>";
	private final String NEWEMAIL = "<your email auth, for modify user>";
	private final String NEWPASSWORD = "<password auth>";
	private final String RESPONSE_DEFAULT = "Success";
	
	@Autowired
	private MockMvc mvc;
	
//	Logger log = LogManager.getLogger(UserControllerTest.class);
//	you can break all comments to test preAutorize test if you want;
//  to check testing api you can breakout comment, but be careful because the test in the comments can change data in database
	@Test
	public void testUserApiBefore() throws Exception {
//		mvc.perform(post("/user/login").contentType(MediaType.MULTIPART_FORM_DATA).param("email", EMAIL).param("password", PASSWORD))
//			.andExpect(status().isOk());
		
//		MockPart name = new MockPart("name",NEWUSERNAME.getBytes());
//		MockPart email = new MockPart("email",NEWEMAIL.getBytes());
//		MockPart password = new MockPart("password",NEWPASSWORD.getBytes());
//		URL url = new URL("https://www.freepnglogos.com/uploads/bunga/vektor-bunga-download-vektor-png-gratis-28.png");
//		BufferedImage imageTest = ImageIO.read(url);
//		ByteArrayOutputStream fileTest = new ByteArrayOutputStream();
//		ImageIO.write(imageTest, "png", fileTest);
//		MockMultipartFile image = new MockMultipartFile("image","imageTest.png","image/png", fileTest.toByteArray());
//		
//		mvc.perform(multipart("/user/signup").file(image).part(name,email,password)).andExpect(status().isNoContent());
		
//		mvc.perform(multipart("/user/signup").part(name,email,password)).andExpect(status().isNoContent());
		
//		mvc.perform(post("/user/verify").contentType(MediaType.MULTIPART_FORM_DATA).param("tkid", Base64.getEncoder().encodeToString(EMAIL.getBytes())))
//		.andExpect(status().isOk());
	
//		mvc.perform(post("/user/verify-oauth").contentType(MediaType.MULTIPART_FORM_DATA)
//			.param("email", Base64.getEncoder().encodeToString(EMAIL.getBytes()))
//			.param("username", Base64.getEncoder().encodeToString(USERNAME.getBytes()))
//			.param("id", ID))
//		.andExpect(status().isOk());
		
		// Logout Api is already tested before, so i didn`t list it
	}
	
	// before run this test, be sure to select profile to development
	// or you can use @Before and catch JWTToken to variable, then add Cookie "JLMS_TOKEN" and add value token to this cookie in the request,  
	// to check testing api you can breakout comment, but be careful because the test in the comments can change data in database
	@Test
	@WithMockUser(username=EMAIL,password=PASSWORD, authorities= {"ADMINISTRATIF","MANAGER"})
	public void testUserApi() throws Exception {
//		mvc.perform(get("/user/get")).andExpect(status().isOk()).andExpect(jsonPath("$.id", is(ID))).andExpect(jsonPath("$.name", is(USERNAME)))
//		.andExpect(jsonPath("$.email", is(EMAIL))).andExpect(jsonPath("$.role", is("MANAGER")));
//		
//		mvc.perform(get("/user/image/18112021082222160.jpeg")).andExpect(status().isOk()).andDo(print());
//		
//		mvc.perform(get("/user/getalluser").param("page", "0").param("size","10")).andExpect(status().isOk()).andDo(print());
//		
//		mvc.perform(get("/user/getalladmin").param("page", "0").param("size","10")).andExpect(status().isOk()).andDo(print());
		
		mvc.perform(post("/user/search").param("page", "0").param("size","10").param("words", "Am")).andExpect(status().isOk()).andDo(print());
		
//		mvc.perform(post("/user/getReport").param("start", "12/01/2021").param("end","12/02/2021")).andExpect(status().isOk()).andDo(print());
		
//		mvc.perform(post("/user/password").contentType(MediaType.MULTIPART_FORM_DATA).param("password", PASSWORD))
//		.andExpect(status().isOk()).andExpect(content().string(RESPONSE_DEFAULT));
//		
//		mvc.perform(post("/user/password/change").contentType(MediaType.MULTIPART_FORM_DATA).param("oldPassword", PASSWORD).param("newPassword", NEWPASSWORD))
//		.andExpect(status().isOk()).andExpect(content().string(RESPONSE_DEFAULT));
//
//		mvc.perform(post("/user/modify/seller").contentType(MediaType.MULTIPART_FORM_DATA).andExpect(status().isOk()).andExpect(content().string(RESPONSE_DEFAULT));
//		
//		mvc.perform(post("/user/modify/admin").contentType(MediaType.MULTIPART_FORM_DATA).param("email", NEWEMAIL).param("delete", "false"))
//		.andExpect(status().isOk()).andExpect(content().string(RESPONSE_DEFAULT));
//		
//		mvc.perform(post("/user/modify/admin").contentType(MediaType.MULTIPART_FORM_DATA).param("email", NEWEMAIL).param("delete", "true"))
//		.andExpect(status().isOk()).andExpect(content().string(RESPONSE_DEFAULT));
//		
		mvc.perform(post("/user/adduseronline").contentType(MediaType.MULTIPART_FORM_DATA).param("id", "1"))
			.andExpect(status().isOk()).andExpect(content().string(RESPONSE_DEFAULT));
		
//		MockMultipartHttpServletRequestBuilder builder = MockMvcRequestBuilders.multipart("/user/modify");
//		builder.with(request -> {
//			request.setMethod("PUT");
//			return request;
//		});
//		MockPart name = new MockPart("name",NEWUSERNAME.getBytes());
//		MockPart email = new MockPart("email",NEWEMAIL.getBytes());
//		URL url = new URL("https://www.freepnglogos.com/uploads/bunga/vektor-bunga-download-vektor-png-gratis-28.png");
//		BufferedImage imageTest = ImageIO.read(url);
//		ByteArrayOutputStream fileTest = new ByteArrayOutputStream();
//		ImageIO.write(imageTest, "png", fileTest);
//		MockMultipartFile image = new MockMultipartFile("image","imageTest.png","image/png", fileTest.toByteArray());
//		mvc.perform(builder.file(image).part(name,email))
//		.andExpect(status().isOk()).andExpect(jsonPath("$.id", is(ID))).andExpect(jsonPath("$.name", is(NEWUSERNAME)))
//		.andExpect(jsonPath("$.email", is(NEWEMAIL))).andExpect(jsonPath("$.role", is("MANAGER")));
//		
//		mvc.perform(delete("/user/delete").param("email",NEWEMAIL)).andExpect(status().isOk())
//		.andExpect(content().string(RESPONSE_DEFAULT));
//		
//		mvc.perform(delete("/user/delete/admin").param("email",NEWEMAIL)).andExpect(status().isOk())
//		.andExpect(content().string(RESPONSE_DEFAULT));
//		
		mvc.perform(delete("/user/delete/useronline").param("id","1")).andExpect(status().isOk())
		.andExpect(content().string(RESPONSE_DEFAULT));
	}
}
