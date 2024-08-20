"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ClusterSelectorProps {
    onClusterChange: (cluster: string) => void;
}

const ClusterSelector: React.FC<ClusterSelectorProps> = ({ onClusterChange }) => {
    const [clusters, setClusters] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClusters = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('http://localhost:5000/api/clusters');
                setClusters(response.data);
            } catch (err) {
                setError('Failed to load clusters');
            } finally {
                setLoading(false);
            }
        };

        fetchClusters();
    }, []);

    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value;
        try {
            await axios.post('http://localhost:5000/api/selected-cluster', { cluster: selected });
            onClusterChange(selected);
        } catch (err) {
            setError('Failed to select cluster');
        }
    };

    return (
        <div>
            {loading && <p>Loading clusters...</p>}
            {error && <p>{error}</p>}
            <select onChange={handleChange} defaultValue="">
                <option value="" disabled>Select a cluster</option>
                {clusters.map((cluster) => (
                    <option key={cluster} value={cluster}>
                        {cluster}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ClusterSelector;
