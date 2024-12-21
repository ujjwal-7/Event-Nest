const formatDate = (isoDateString ) => {

    const date = new Date(isoDateString);

    const dateOptions = {
        weekday: 'short', // WED
        month: 'short',   // AUG
        day: 'numeric',   // 14
        year: 'numeric',
    
    };

    const formatter = new Intl.DateTimeFormat('en-US', dateOptions);
    const formattedDate = formatter.format(date);

    return formattedDate;

}

export default formatDate;