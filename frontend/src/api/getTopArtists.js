export async function getTopArtists(timeRange) {
    const url = `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}`;
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
            console.warn('Top artists not found.');
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching Top Artists:', error);
        return null;
    }
}