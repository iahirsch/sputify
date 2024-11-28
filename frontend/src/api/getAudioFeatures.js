export async function getAudioFeatures(id) {
    const url = `https://api.spotify.com/v1/audio-features/${id}`;
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        console.error('Access token is undefined');
        return null;
    }

    if (id) {
        const payload = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        try {
            const response = await fetch(url, payload);
            if (!response.ok) {
                console.warn(`Audio features for ID ${id} not found.`);
                return null;
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching audio features:', error);
            return null;
        }
    }
}