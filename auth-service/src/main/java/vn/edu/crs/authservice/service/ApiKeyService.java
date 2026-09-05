package vn.edu.crs.authservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.crs.authservice.dto.ApiKeyCreateRequestDTO;
import vn.edu.crs.authservice.dto.ApiKeyResponseDTO;
import vn.edu.crs.authservice.entity.ApiKey;
import vn.edu.crs.authservice.repository.ApiKeyRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private static final String ACTIVE =
            "ACTIVE";

    private static final String REVOKED =
            "REVOKED";

    private static final SecureRandom RANDOM =
            new SecureRandom();

    private final ApiKeyRepository apiKeyRepository;

    /*
     * Cap API Key moi
     */
    public ApiKeyResponseDTO create(
            ApiKeyCreateRequestDTO dto
    ) {

        ApiKey apiKey =
                new ApiKey();

        apiKey.setKeyValue(
                generateRandomKey()
        );

        apiKey.setOwnerName(
                dto.getOwnerName()
        );

        apiKey.setScopes(
                dto.getScopes()
        );

        apiKey.setStatus(
                ACTIVE
        );

        apiKey.setCreatedAt(
                LocalDateTime.now()
        );

        if (dto.getValidDays() != null) {

            apiKey.setExpiresAt(
                    LocalDateTime.now()
                            .plusDays(
                                    dto.getValidDays()
                            )
            );

        } else {

            apiKey.setExpiresAt(
                    null
            );
        }

        ApiKey saved =
                apiKeyRepository.save(
                        apiKey
                );

        return toDTO(saved);
    }

    /*
     * Lay danh sach tat ca API Key
     */
    public List<ApiKeyResponseDTO> getAll() {

        return apiKeyRepository
                .findAll()
                .stream()
                .map(this::toDTO)
                .collect(
                        Collectors.toList()
                );
    }

    /*
     * Thu hoi API Key
     */
    public void revoke(
            Long id
    ) {

        ApiKey apiKey =
                apiKeyRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new NoSuchElementException(
                                                "Khong tim thay API Key id = "
                                                        + id
                                        )
                        );

        apiKey.setStatus(
                REVOKED
        );

        apiKeyRepository.save(
                apiKey
        );
    }

    /*
     * Kiem tra API Key co hop le
     * voi scope duoc yeu cau hay khong.
     */
    public boolean isValidForScope(
            String keyValue,
            String requiredScope
    ) {

        return apiKeyRepository
                .findByKeyValue(keyValue)

                // Key phai dang ACTIVE
                .filter(
                        key ->
                                ACTIVE.equals(
                                        key.getStatus()
                                )
                )

                // Key chua het han
                .filter(
                        key ->
                                key.getExpiresAt() == null
                                        ||
                                        key.getExpiresAt()
                                                .isAfter(
                                                        LocalDateTime.now()
                                                )
                )

                // Key phai co dung scope
                .filter(
                        key ->
                                Arrays.stream(
                                                key.getScopes()
                                                        .split(",")
                                        )
                                        .map(String::trim)
                                        .anyMatch(
                                                requiredScope::equals
                                        )
                )

                .isPresent();
    }

    /*
     * Sinh API Key ngau nhien
     */
    private String generateRandomKey() {

        byte[] bytes =
                new byte[24];

        RANDOM.nextBytes(
                bytes
        );

        return "crs_"
                + Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(
                        bytes
                );
    }

    /*
     * Entity -> DTO
     */
    private ApiKeyResponseDTO toDTO(
            ApiKey apiKey
    ) {

        return new ApiKeyResponseDTO(
                apiKey.getId(),
                apiKey.getKeyValue(),
                apiKey.getOwnerName(),
                apiKey.getScopes(),
                apiKey.getStatus(),
                apiKey.getExpiresAt(),
                apiKey.getCreatedAt()
        );
    }
}