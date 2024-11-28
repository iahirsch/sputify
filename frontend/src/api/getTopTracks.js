export async function getTopTracks(timeRange) {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token is undefined');
        return null;
    }

    const payload = {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };

    try {
        const url1 = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50`;
        const response1 = await fetch(url1, payload);
        if (!response1.ok) {
            console.warn('Top tracks not found.');
            return null;
        }
        const data1 = await response1.json();

        const url2 = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50&offset=50`;
        const response2 = await fetch(url2, payload);
        if (!response2.ok) {
            console.warn('Top tracks not found.');
            return null;
        }
        const data2 = await response2.json();

        const combinedData = {
            items: [...data1.items, ...data2.items]
        };

        return combinedData;
    } catch (error) {
        console.error('Error fetching Top Tracks:', error);
        return null;
    }
}