"use client";
import React, { useState, useEffect } from 'react';

export function Stat() {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Function to fetch statistics from the API
        const fetchStatistics = async () => {
            try {
                const response = await fetch('/api/images');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setStatistics(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div>
            <h3>Image Statistics</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-dark table-hover" style={{ 
                    borderCollapse: 'separate', 
                    borderSpacing: '10px', 
                    width: '50%' ,
                    border: '1px solid #ddd'
                }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ccc', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ccc', textAlign: 'left' }}>Registry Name</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ccc', textAlign: 'left' }}>Number of Images</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ccc', textAlign: 'left' }}>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statistics.map((stat: any) => (
                            <tr key={stat.id}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{stat.id}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{stat.registry_name}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{stat.number_of_images}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{stat.percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
