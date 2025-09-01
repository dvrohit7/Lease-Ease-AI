package com.example.auth.service;

import com.example.auth.model.Owner;
import com.example.auth.model.Property;
import com.example.auth.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {
    @Autowired
    private PropertyRepository propertyRepository;

    public Property addProperty(Property property) {
        return propertyRepository.save(property);
    }

    // ✅ Now accepts Owner directly
    public List<Property> getPropertiesByOwner(Owner owner) {
        return propertyRepository.findByOwner(owner);
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    public Property updateProperty(Long id, Property updatedProperty) {
        Optional<Property> optionalProperty = propertyRepository.findById(id);
        if (optionalProperty.isEmpty()) {
            throw new RuntimeException("Property not found");
        }
        Property property = optionalProperty.get();
        property.setTitle(updatedProperty.getTitle());
        property.setDescription(updatedProperty.getDescription());
        property.setLocation(updatedProperty.getLocation());
        property.setPrice(updatedProperty.getPrice());
        property.setType(updatedProperty.getType());
        property.setActive(updatedProperty.isActive());
        return propertyRepository.save(property);
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }
}
