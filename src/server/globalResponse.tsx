export function responseError(errors: any) {
    return  {
        errors: typeof errors === "string" ? {message: errors} : errors
    }
}

export function responseSuccess(data: any) {
    return  {
        content: typeof data === "string" ? {message: data} : data
    }
}