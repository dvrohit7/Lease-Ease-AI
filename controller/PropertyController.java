package com.example.auth.controller;

import com.example.auth.dto.PropertyDTO;
import com.example.auth.exception.BadRequestException;
import com.example.auth.exception.ResourceNotFoundException;
import com.example.auth.model.Owner;
import com.example.auth.model.Property;
import com.example.auth.service.OwnerService;
import com.example.auth.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.*;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" }, allowCredentials = "true")
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired private PropertyService propertyService;
    @Autowired private OwnerService ownerService;

    @PostMapping(value = "/create-with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PropertyDTO> addPropertyWithImage(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String location,
            @RequestParam Double price,
            @RequestParam String type,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Principal principal
    ) throws IOException {
        if (principal == null) {
            throw new BadRequestException("User is not authenticated.");
        }

        Owner owner = ownerService.findByEmail(principal.getName());
        if (owner == null) {
            throw new BadRequestException("No valid owner found for user: " + principal.getName());
        }

        Property property = new Property();
        property.setTitle(title);
        property.setDescription(description);
        property.setLocation(location);
        property.setPrice(price);
        property.setType(type);
        property.setActive(true);
        property.setOwner(owner);

        if (file != null && !file.isEmpty()) {
            // (Optional) validate content type & size
            // if (!file.getContentType().startsWith("image/")) throw new BadRequestException("Only images allowed");

            Path uploadDir = Paths.get("uploads");
            Files.createDirectories(uploadDir);

            String safeName = UUID.randomUUID() + "_" + Paths.get(file.getOriginalFilename()).getFileName().toString();
            Path filePath = uploadDir.resolve(safeName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            property.setImageUrl("/uploads/" + safeName);
        }

        Property saved = propertyService.addProperty(property);

        var locationUri = ServletUriComponentsBuilder.fromCurrentRequest()
                .replacePath("/api/properties/{id}")
                .buildAndExpand(saved.getId())
                .toUri();

        return ResponseEntity.created(locationUri).body(PropertyDTO.from(saved));
    }

    @GetMapping
    public ResponseEntity<List<PropertyDTO>> getAllPropertiesAlias() {
        List<PropertyDTO> list = propertyService.getAllProperties()
                .stream().map(PropertyDTO::from).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PropertyDTO>> getAllProperties() {
        List<PropertyDTO> list = propertyService.getAllProperties()
                .stream().map(PropertyDTO::from).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<PropertyDTO>> getMyProperties(Principal principal) {
        if (principal == null) {
            throw new BadRequestException("User is not authenticated.");
        }
        Owner owner = ownerService.findByEmail(principal.getName());
        if (owner == null) {
            throw new BadRequestException("No valid owner found for user: " + principal.getName());
        }

        List<PropertyDTO> list = propertyService.getPropertiesByOwner(owner)
                .stream().map(PropertyDTO::from).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long id) {
        Property p = propertyService.getPropertyById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        return ResponseEntity.ok(PropertyDTO.from(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDTO> updateProperty(@PathVariable Long id, @RequestBody Property property) {
        Property updated = propertyService.updateProperty(id, property);
        return ResponseEntity.ok(PropertyDTO.from(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}
