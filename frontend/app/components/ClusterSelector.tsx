"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClusterSelectorAndStats: React.FC = () => {
    const [clusters, setClusters] = useState<string[]>([]);
    const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [statsLoading, setStatsLoading] = useState<boolean>(false);

    // Fetch clusters on component mount
    useEffect(() => {
        const fetchClusters = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/clusters');
                setClusters(response.data);
            } catch (err) {
                setError('Failed to fetch clusters');
            } finally {
                setLoading(false);
            }
        };

        fetchClusters();
    }, []);

    // Handle cluster selection
    const handleClusterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCluster(event.target.value);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (selectedCluster) {
            setStatsLoading(true);
            setError(null);

            try {
                // POST request to process the selected cluster
                await axios.post('http://localhost:5000/api/selected-cluster', { cluster: selectedCluster });

                // Notify the Stat component to fetch statistics
                window.dispatchEvent(new CustomEvent('update-statistics', { detail: { cluster: selectedCluster } }));
            } catch (err) {
                setError('Failed to process cluster');
                console.error("Error processing cluster:", err);
            } finally {
                setStatsLoading(false);
            }
        } else {
            alert('Please select a cluster');
        }
    };

    if (loading) return <p>Loading clusters...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Kubernetes Clusters</h2>
            {clusters.length === 0 ? (
                <p>No clusters available</p>
            ) : (
                <div>
                    <select onChange={handleClusterSelect} value={selectedCluster || ''}>
                        <option value="">Select a cluster</option>
                        {clusters.map((cluster, index) => (
                            <option key={index} value={cluster}>
                                {cluster}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleSubmit} disabled={statsLoading}>
                        {statsLoading ? 'Loading...' : 'Submit'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClusterSelectorAndStats;
