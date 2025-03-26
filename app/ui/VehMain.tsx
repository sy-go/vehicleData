'use client'
import { fetchDVLA } from "../lib/data";
import { VehicleDetails } from '@/app/lib/types';
import { useState, useEffect } from 'react';

interface VehMainProps {  //Define the props interface
    reg: string;
}

export default function VehMain({ reg }: VehMainProps) {  // Destructure props

    const [dvlaData, setDvlaData] = useState<VehicleDetails | null>(null);  //Use VehicleDetails
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);  //clear previous errors
            try {
                const data = await fetchDVLA(reg);
                setDvlaData(data);
            } catch (e: any) {
                setError(e.message || "An error occurred");
                setDvlaData(null); //clear
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reg]);  //re-run when registration changes

    return (
        <div>
            <div>New POST response:</div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {dvlaData && (
                <p>Vehicle: {dvlaData.make}</p>
            )}
        </div>
    );
}
