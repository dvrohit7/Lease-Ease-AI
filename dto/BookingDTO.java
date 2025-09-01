package com.example.auth.dto;

import com.example.auth.model.Booking;
import com.example.auth.model.BookingStatus;
import com.example.auth.model.Property;
import com.example.auth.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private String status;
    private Instant createdAt;

    // Property summary shown in the owner dashboard
    private PropertySummary property;

    // Always safe to show to owner (they need to know who requested)
    private String userEmail;

    // Shown ONLY if APPROVED
    private String userName;
    private String userMobile;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PropertySummary {
        private Long id;
        private String title;
        private String location;
        private Double price;       // ✅ changed from Long → Double
        private String imageUrl;

        public static PropertySummary of(Property p) {
            if (p == null) return null;
            return new PropertySummary(
                    p.getId(),
                    p.getTitle(),
                    p.getLocation(),
                    p.getPrice(),      // now matches Double
                    p.getImageUrl()
            );
        }
    }

    /**
     * Map a Booking to BookingDTO.
     * If includeContact == true, name & mobile are included.
     */
    public static BookingDTO from(Booking b, boolean includeContact) {
        BookingDTO dto = new BookingDTO();
        dto.setId(b.getId());
        dto.setStatus(b.getStatus() != null ? b.getStatus().name() : BookingStatus.PENDING.name());
        dto.setCreatedAt(b.getCreatedAt());
        dto.setProperty(PropertySummary.of(b.getProperty()));

        User u = b.getUser();
        if (u != null) {
            dto.setUserEmail(u.getEmail());

            if (includeContact) {
                // Handle both "mobile" and "mobileNumber" field names gracefully
                String mobile = null;
                try { mobile = (String) User.class.getMethod("getMobile").invoke(u); } catch (Exception ignored) {}
                if (mobile == null) {
                    try { mobile = (String) User.class.getMethod("getMobileNumber").invoke(u); } catch (Exception ignored) {}
                }

                dto.setUserName(u.getName());   // assumes getName()
                dto.setUserMobile(mobile);
            }
        }
        return dto;
    }
}
