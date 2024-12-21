export const setLocalStorageItem = (key, value) => {
  
    localStorage.setItem(key, JSON.stringify(value));
};
  
export const getLocalStorageItem = (key, defaultValue = null) => {
   
    const storedValue = localStorage.getItem(key);
    
    if(storedValue) {
        return JSON.parse(storedValue);
    }
    return defaultValue;
};

export const removeLocalStorageItem = (key) => {
    localStorage.removeItem(key);
}