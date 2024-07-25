import { toast } from "sonner"

export class AppError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleError = (error: unknown) => {
    console.error('An error occurred:', error);

    if (error instanceof AppError) {
        toast(`Error: ${error.message}`);
    } else if (error instanceof Error) {
        toast(`Unexpected error: ${error.message}`);
    } else {
        toast('An unexpected error occurred');
    }
};