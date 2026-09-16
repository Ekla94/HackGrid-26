const BASE_URL = 'http://localhost:8000';

export const getArbitrage = async (crop, fpoLocation) => {
    try {
        const response = await fetch(`${BASE_URL}/api/arbitrage?crop=${encodeURIComponent(crop)}&fpo_location=${encodeURIComponent(fpoLocation)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch arbitrage data:', error);
        throw error;
    }
};

export const generateContract = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/api/contract`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to generate contract:', error);
        throw error;
    }
};

export const getLogistics = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/logistics`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch logistics data:', error);
        throw error;
    }
};
