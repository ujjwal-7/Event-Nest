export const  getEventStatus = (startDate, endDate) => {

    const currentDate = new Date();
    
    let status = "Ongoing";
    if (new Date(endDate) < currentDate) {
      status = "Expired";
    } else if (new Date(startDate) > currentDate) {
      status = "Upcoming";
    }

    return status;
};
