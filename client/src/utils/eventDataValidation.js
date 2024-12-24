const eventDataValidation = (eventData, selectedFile) => {

    let errors = {};

    if (!eventData.title) errors.title = "Title is required.";
    if (!eventData.categoryId) errors.categoryId = "Category is required.";
    if (!eventData.startDate) errors.startDate = "Start date is required.";
    if (!eventData.endDate) errors.endDate = "End date is required.";
    if (!eventData.startTime) errors.startTime = "Start time is required.";
    if (!eventData.endTime) errors.endTime = "End time is required.";
    if (!eventData.address.street) errors.street = "Street is required.";
    if (!eventData.address.city) errors.city = "City is required.";
    if (!eventData.address.country) errors.country = "Country is required.";
    if (!eventData.address.state) errors.state = "State is required.";
    if (!eventData.address.postalCode) errors.postalCode = "Postal code is required.";

    if (!eventData.seats || Number(eventData.seats) < 1) {
        errors.seats = "Seats must be greater than or equal to 1.";
    }
    
    if(!eventData.price || eventData.price < 0) {
        errors.price = "Price can't be negative."
    }
    
    if (!eventData.description) errors.description = "Description is required.";

    if (eventData.startDate && eventData.endDate) {
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);

        if (startDate > endDate) {
            errors.startDate = "Start date must be before or equal to end date.";
        }
    }

    if (eventData.startDate && eventData.endDate && eventData.startTime && eventData.endTime) {
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);

        if (startDate.toDateString() === endDate.toDateString()) {
            // Parse times
            const [startHour, startMinute] = eventData.startTime.split(":").map(Number);
            const [endHour, endMinute] = eventData.endTime.split(":").map(Number);

            const startTime = startHour * 60 + startMinute; // Convert to total minutes
            const endTime = endHour * 60 + endMinute; // Convert to total minutes

            if (startTime >= endTime) {
                errors.startTime = "Start time must be before end time.";
            }
        }
    }

    return errors;
}

export default eventDataValidation;