// Validate URL format
function isValidUrl(urlString) {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
}

// Validate bookmark data
function validateBookmark(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate || data.title !== undefined) {
        if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
            errors.push('Title is required');
        }
    }

    if (!isUpdate || data.url !== undefined) {
        if (!data.url || typeof data.url !== 'string') {
            errors.push('URL is required');
        } else if (!isValidUrl(data.url)) {
            errors.push('URL must be a valid URL');
        }
    }

    if (!isUpdate || data.categoryId !== undefined) {
        if (data.categoryId === undefined || data.categoryId === null) {
            errors.push('Category is required');
        } else if (typeof data.categoryId !== 'number') {
            errors.push('Category ID must be a number');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validate category data
function validateCategory(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        errors.push('Category name is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    isValidUrl,
    validateBookmark,
    validateCategory
};
