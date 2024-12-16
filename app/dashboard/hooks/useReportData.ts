import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useReportData = (reportId: string, filters: Record<string, string[]>) => {
    const [page, setPage] = useState(1);
    const pageSize = 50;

    const fetchReportData = async () => {
        const response = await fetch(`${API_URL}/reports/${reportId}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filters,
                page,
                pageSize
            })
        });

        if (!response.ok) throw new Error('Failed to fetch report data');
        return response.json();
    };

    const query = useQuery({
        queryKey: ['reportData', reportId, filters, page],
        queryFn: fetchReportData,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });

    return {
        ...query,
        page,
        setPage,
        pageSize,
        totalItems: query.data?.totalItems || 0
    };
};