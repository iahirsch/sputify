export async function getRecentlyPlayed() {
    const url = 'https://api.spotify.com/v1/me/player/recently-played';
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
            console.warn('Failed to fetch recently played tracks.');
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching recently played tracks:', error);
        return null;
    }
}
