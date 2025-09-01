package com.example.auth.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
    private static final Logger log = LoggerFactory.getLogger(StaticResourceConfig.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolute = "file:///C:/Users/dubis/Downloads/auth/uploads/"; // trailing slash is IMPORTANT
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(absolute)
                .setCachePeriod(0);
    }

}
