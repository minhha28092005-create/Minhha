package vn.edu.crs.apigateway.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class AuthServiceClient {

    private final RestClient restClient;

    public AuthServiceClient(
            RestClient.Builder restClientBuilder
    ) {
        this.restClient = restClientBuilder
                .baseUrl("http://localhost:8081")
                .build();
    }

    public boolean isValidForScope(
            String key,
            String scope
    ) {

        try {

            Map response = restClient
                    .get()
                    .uri(uriBuilder ->
                            uriBuilder
                                    .path("/internal/api-keys/validate")
                                    .queryParam("key", key)
                                    .queryParam("scope", scope)
                                    .build()
                    )
                    .retrieve()
                    .body(Map.class);

            if (response == null) {
                return false;
            }

            return Boolean.TRUE.equals(
                    response.get("valid")
            );

        } catch (Exception e) {

            // Fail-safe:
            // neu khong kiem tra duoc key
            // thi tu choi truy cap.
            return false;
        }
    }
}