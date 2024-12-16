import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Report {
    _id: string;
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
}

export const useReports = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/reports`);
                console.log("reports response: ", response);
                setReports(response.ok ? await response.json() : []);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch reports');
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    return { reports, isLoading, error };
};