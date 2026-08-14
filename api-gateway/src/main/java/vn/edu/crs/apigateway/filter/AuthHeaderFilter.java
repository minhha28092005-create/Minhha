package vn.edu.crs.apigateway.filter;

import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

public class AuthHeaderFilter {


    public static HandlerFilterFunction<ServerResponse, ServerResponse> requireJwt() {


        return (request, next) -> {


            String path = request.path();


            // ==========================================
            // CÁC API PUBLIC KHÔNG CẦN JWT
            // ==========================================

            // Login
            if (path.equals("/api/auth/login")) {
                return next.handle(request);
            }


            // GET danh sách course public
            if (path.startsWith("/api/courses")
                    && request.method().name().equals("GET")) {

                return next.handle(request);
            }


            // Public partner API
            if (path.equals("/api/public/courses")) {
                return next.handle(request);
            }



            // ==========================================
            // CÁC API CÒN LẠI BẮT BUỘC JWT
            // ==========================================

            String authHeader = request.headers()
                    .firstHeader("Authorization");


            if (authHeader == null || authHeader.isBlank()) {

                return ServerResponse
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Missing Authorization header");
            }



            if (!authHeader.startsWith("Bearer ")) {

                return ServerResponse
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid Authorization header");
            }


            return next.handle(request);
        };
    }
}