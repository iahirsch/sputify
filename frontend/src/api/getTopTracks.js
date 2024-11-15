export async function getTopTracks(timeRange) {
    const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}`;
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
        const response = await fetch(url, payload);
        if (!response.ok) {
            console.warn('Top tracks not found.');
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching Top Tracks:', error);
        return null;
    }
}