export async function getAudioAnalysis(id) {
    const url = `https://api.spotify.com/v1/audio-analysis/${id}`;
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
                console.warn(`Audio analysis for ID ${id} not found.`);
                return null;
            }
            const data = await response.json();
            return data.sections;
        } catch (error) {
            console.error('Error fetching audio analysis:', error);
            return null;
        }
    }
}