package vn.edu.crs.apigateway.filter;

import org.springframework.cloud.gateway.server.mvc.filter.SimpleFilterSupplier;

public class AuthHeaderFilterSupplier extends SimpleFilterSupplier {

    public AuthHeaderFilterSupplier() {
        super(AuthHeaderFilter.class);
    }
}