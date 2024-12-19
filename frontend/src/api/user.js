export async function getUserInfo() {
    const url = "https://api.spotify.com/v1/me";
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
            console.error('Error fetching user profile:', response.statusText);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}