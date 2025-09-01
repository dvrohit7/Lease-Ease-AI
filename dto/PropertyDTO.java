package com.example.auth.dto;

import com.example.auth.model.Property;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PropertyDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Double price;
    private String type;
    private boolean active;
    private String imageUrl;
    private String ownerName;
    private String ownerEmail;

    public static PropertyDTO from(Property p) {
        return new PropertyDTO(
                p.getId(),
                p.getTitle(),
                p.getDescription(),
                p.getLocation(),
                p.getPrice(),
                p.getType(),
                p.isActive(),
                p.getImageUrl(),
                p.getOwner() != null ? p.getOwner().getName() : null,
                p.getOwner() != null ? p.getOwner().getEmail() : null
        );
    }
}
