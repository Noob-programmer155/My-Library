package test.configurationFileTest;

import java.io.IOException;
import java.util.List;

import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.Resource;

public class YamlConfigurationSourceFile implements ApplicationContextInitializer<ConfigurableApplicationContext> {
	@Override
	public void initialize(ConfigurableApplicationContext applicationContext) {
		try {
			Resource resource = applicationContext.getResource("classpath:application.yml");
			YamlPropertySourceLoader loader = new YamlPropertySourceLoader();
			List<PropertySource<?>> globalProperties = loader.load("TestGlobalProperties", resource);
			applicationContext.getEnvironment().getPropertySources().addFirst(globalProperties.get(0));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
