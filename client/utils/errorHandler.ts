export interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: string;
}

export class ErrorHandler {
  static parse(error: unknown): APIError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: "UNKNOWN_ERROR",
        details: error.stack,
      };
    }

    if (typeof error === "object" && error !== null) {
      const err = error as Record<string, any>;
      return {
        message: err.message || "An unknown error occurred",
        code: err.code || "UNKNOWN_ERROR",
        status: err.status,
        details: err.details,
      };
    }

    return {
      message: "An unknown error occurred",
      code: "UNKNOWN_ERROR",
    };
  }

  static getUserMessage(error: APIError): string {
    // Provide user-friendly error messages
    const messages: Record<string, string> = {
      VALIDATION_ERROR: "Please check your input and try again.",
      NOT_FOUND: "The requested item was not found.",
      UNAUTHORIZED: "You don't have permission to perform this action.",
      DUPLICATE: "This item already exists.",
      INVALID_EMAIL: "Please enter a valid email address.",
      INVALID_PHONE: "Please enter a valid phone number.",
      NETWORK_ERROR: "Network connection failed. Please try again.",
      SERVER_ERROR: "Server error. Please try again later.",
      MISSING_REQUIRED: "Please fill in all required fields.",
    };

    return messages[error.code || "UNKNOWN_ERROR"] || error.message;
  }

  static log(error: APIError, context?: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${context || "Error"}: ${error.code} - ${error.message}`;
    
    if (error.details) {
      console.error(logMessage, error.details);
    } else {
      console.error(logMessage);
    }
  }
}

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[\d\s+\-()]+$/;
  return re.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 999999.99;
};

export const validateInvoiceNumber = (invoiceNumber: string): boolean => {
  return invoiceNumber.trim().length > 0 && invoiceNumber.length <= 50;
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value: string | number | undefined): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
};
