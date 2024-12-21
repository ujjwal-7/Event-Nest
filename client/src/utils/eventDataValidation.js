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
    
    if (!eventData.description) errors.description = "Description is required.";

    return errors;
}

export default eventDataValidation;