package test.configurationFileTest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ObjectBuilder {
	public static String ObjectToJsonString(Object object) {
		try {
			ObjectMapper map = new ObjectMapper();
			return map.writeValueAsString(object);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}
	}
}
