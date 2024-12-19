export async function getArtist(id) {
    const url = `https://api.spotify.com/v1/artists/${id}`;
    const accessToken = localStorage.getItem('access_token');

    if (!id) {
        console.error('Error: Artist ID is required');
        return null;
    }

    if (!accessToken) {
        console.error('Access token is undefined');
        return null;
    }

    const payload = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    };

    try {
        const response = await fetch(url, payload);
        if (!response.ok) {
            console.warn(`Artist with ID ${id} not found.`);
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching Artist:', error);
        return null;
    }
}
