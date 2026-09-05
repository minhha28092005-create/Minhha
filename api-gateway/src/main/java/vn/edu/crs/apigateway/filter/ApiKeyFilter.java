package vn.edu.crs.apigateway.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import vn.edu.crs.apigateway.cache.ApiKeyValidationCache;
import vn.edu.crs.apigateway.client.AuthServiceClient;

import java.io.IOException;

@Component
@Order(-2)
public class ApiKeyFilter extends OncePerRequestFilter {

    private static final String PARTNER_PATH =
            "/api/public/courses";

    private static final String REQUIRED_SCOPE =
            "courses:read";

    private final AuthServiceClient authServiceClient;

    private final ApiKeyValidationCache cache;

    public ApiKeyFilter(
            AuthServiceClient authServiceClient,
            ApiKeyValidationCache cache
    ) {
        this.authServiceClient = authServiceClient;
        this.cache = cache;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Khong phai route doi tac -> cho qua
        if (!path.startsWith(PARTNER_PATH)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Lay API Key tu header
        String apiKey =
                request.getHeader("X-API-KEY");

        if (apiKey == null || apiKey.isBlank()) {
            reject(response);
            return;
        }

        // Cache theo ca key va scope
        String cacheKey =
                apiKey + ":" + REQUIRED_SCOPE;

        Boolean cached =
                cache.get(cacheKey);

        // Neu cache da co ket qua
        if (cached != null) {

            if (cached) {
                filterChain.doFilter(request, response);
            } else {
                reject(response);
            }

            return;
        }

        // Chua co cache -> hoi auth-service
        boolean valid =
                authServiceClient.isValidForScope(
                        apiKey,
                        REQUIRED_SCOPE
                );

        cache.put(
                cacheKey,
                valid
        );

        if (!valid) {
            reject(response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void reject(
            HttpServletResponse response
    ) {

        response.setStatus(
                HttpServletResponse.SC_FORBIDDEN
        );
    }
}