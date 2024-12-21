export const validateSignUpData = (data) => {
    let errors = {};

    if (!data.firstName) {
        errors.firstName = "First name is required";
    }

    if (!data.lastName) {
        errors.lastName = "Last name is required";
    }

    if (!data.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Email address is invalid";
    }

    if (!data.mobile) {
        errors.mobile = "Phone number is required";
    }

    if (!data.password) {
        errors.password = "Password is required";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+={}\[\]|:;"'<>,.?/\\`~])[A-Za-z\d@$!%*?&^#()_+={}\[\]|:;"'<>,.?/\\`~]{8,}$/.test(data.password)) {
        errors.password = "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};
