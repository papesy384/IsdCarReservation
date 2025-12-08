# Hardcoded English Strings Report

This document lists all hardcoded English strings found in the codebase that are not wrapped in translation functions (e.g., `t('...')`).

## Summary
Total files with hardcoded strings: 8
Total hardcoded strings found: 35+

---

## File-by-File Breakdown

### 1. `src/components/BookingForm.tsx`

**Line 122**: `'Please select both date and time'` / `'Veuillez sélectionner la date et l\'heure'`
- Context: Error message in conditional
- Should use: Translation key

**Line 178**: `'Failed to create booking'`
- Context: Error toast message
- Should use: Translation key

**Line 191**: `'Booking Confirmation'`
- Context: Confirmation dialog heading
- Should use: Translation key

**Line 192**: `'Please review your booking details'`
- Context: Confirmation dialog description
- Should use: Translation key

**Line 196**: `'Date:'`
- Context: Label in confirmation dialog
- Should use: Translation key

**Line 200**: `'Time:'`
- Context: Label in confirmation dialog
- Should use: Translation key

**Line 204**: `'Destination:'`
- Context: Label in confirmation dialog
- Should use: Translation key

**Line 208**: `'Passengers:'`
- Context: Label in confirmation dialog
- Should use: Translation key

**Line 212**: `'Vehicle:'`
- Context: Label in confirmation dialog
- Should use: Translation key

**Line 216**: `'Purpose:'`
- Context: Label in confirmation dialog
- Should use: Translation key

**Line 227**: `'Back to Edit'`
- Context: Button text in confirmation dialog
- Should use: Translation key

**Line 233**: `'Confirm Booking'`
- Context: Button text in confirmation dialog
- Should use: Translation key

**Line 248**: `'Fill out the form below to request a vehicle'`
- Context: Description text below form title
- Should use: Translation key

**Line 304**: `'Enter destination address'`
- Context: Input placeholder
- Should use: Translation key

**Line 332**: `'Maximum capacity: {selectedCapacity} passengers'`
- Context: Helper text showing vehicle capacity
- Should use: Translation key with interpolation

---

### 2. `src/components/MyBookings.tsx`

**Line 142**: `'Failed to cancel booking'`
- Context: Error toast message
- Should use: Translation key

**Line 160**: `'Failed to cancel some bookings'`
- Context: Error toast message for bulk operations
- Should use: Translation key

**Line 244**: `'View and manage your booking requests'`
- Context: Subtitle/description text
- Should use: Translation key

**Line 252**: `'Navigate to booking form'`
- Context: Toast info message
- Should use: Translation key

**Line 265**: `'View and manage your booking requests'`
- Context: Subtitle/description text (duplicate)
- Should use: Translation key

**Line 531**: `'Failed to update booking'`
- Context: Error toast message
- Should use: Translation key

---

### 3. `src/components/admin/ApprovalsTab.tsx`

**Line 125**: `'Failed to approve booking'`
- Context: Error toast message
- Should use: Translation key

**Line 143**: `'Failed to approve some bookings'`
- Context: Error toast message for bulk operations
- Should use: Translation key

**Line 162**: `'Failed to deny some bookings'`
- Context: Error toast message for bulk operations
- Should use: Translation key

**Line 195**: `'Failed to deny booking'`
- Context: Error toast message
- Should use: Translation key

---

### 4. `src/components/admin/ReportsTab.tsx`

**Line 92**: `'Error loading report data:'`
- Context: Console error message (may be acceptable, but could be translated)
- Should use: Translation key (optional for console logs)

---

### 5. `src/components/admin/UsersTab.tsx`

**Line 96**: `'Failed to add user'`
- Context: Error toast message
- Should use: Translation key

**Line 111**: `'Failed to update user'`
- Context: Error toast message
- Should use: Translation key

**Line 124**: `'Failed to delete user'`
- Context: Error toast message
- Should use: Translation key

---

### 6. `src/components/admin/VehiclesTab.tsx`

**Line 102**: `'Failed to add vehicle'`
- Context: Error toast message
- Should use: Translation key

**Line 117**: `'Failed to update vehicle'`
- Context: Error toast message
- Should use: Translation key

**Line 130**: `'Failed to delete vehicle'`
- Context: Error toast message
- Should use: Translation key

---

### 7. `src/components/DriverInterface.tsx`

**Line 81**: `'Failed to start trip'`
- Context: Error toast message
- Should use: Translation key

**Line 93**: `'Failed to complete trip'`
- Context: Error toast message
- Should use: Translation key

---

### 8. `src/components/Signup.tsx`

**Lines 71-76**: Department names array
- `'Administration'`
- `'Teaching'`
- `'Maintenance'`
- `'IT'`
- `'Security'`
- `'Transportation'`
- Context: Department options in select dropdown
- Should use: Translation keys (these are user-facing options)

---

### 9. `src/components/ConfirmDialog.tsx`

**Line 29**: `'Confirm'` (default value)
- Context: Default confirm button text
- Should use: Translation key (though this is a default, callers should pass translated text)

**Line 30**: `'Cancel'` (default value)
- Context: Default cancel button text
- Should use: Translation key (though this is a default, callers should pass translated text)

---

### 10. `src/components/Navigation.tsx`

**Line 77**: `'ISD Car Reservation'`
- Context: Brand name/logo text
- Note: This may be intentional as a brand name, but could be translatable

---

### 11. `src/components/figma/ImageWithFallback.tsx`

**Line 21**: `'Error loading image'`
- Context: Alt text for error image
- Should use: Translation key

---

## Priority Recommendations

### High Priority (User-Facing UI Text)
1. All confirmation dialog labels and buttons in `BookingForm.tsx` (lines 191-233)
2. All error toast messages (multiple files)
3. Form descriptions and helper text
4. Department names in `Signup.tsx`
5. Placeholder text in inputs

### Medium Priority
1. Console error messages (can remain in English for debugging)
2. Default values in reusable components (should be passed as props)

### Low Priority
1. Brand names (may be intentionally untranslated)
2. Technical error messages in console logs

---

## Next Steps

1. Add all identified strings to translation files (`en.json` and `fr.json`)
2. Replace hardcoded strings with `t('translation.key')` calls
3. For components using local `translations` objects, migrate to i18n system
4. Test language switching to ensure all strings are properly translated

