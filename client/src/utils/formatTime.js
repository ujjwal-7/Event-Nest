const formatTime = (time) => {
 
    const [hours24, minutes] = time.split(':').map(Number);
    
    const suffix = hours24 >= 12 ? 'PM' : 'AM';
    
    const hours12 = hours24 % 12 || 12; 
  
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${hours12}:${formattedMinutes} ${suffix}`;
  }
  
  export default formatTime;