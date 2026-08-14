package vn.edu.crs.apigateway.filter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfiguration {

    @Bean
    public AuthHeaderFilterSupplier authHeaderFilterSupplier() {
        return new AuthHeaderFilterSupplier();
    }
}