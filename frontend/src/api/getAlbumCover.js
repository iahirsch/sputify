export async function getAlbumCover(albumId) {
    const url = `https://api.spotify.com/v1/albums/${albumId}`;
    const accessToken = localStorage.getItem('access_token');
  
    if (!accessToken) {
      console.error('Access token is undefined');
      return null;
    }
  
    if (albumId) {
      const payload = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
  
      try {
        const response = await fetch(url, payload);
        if (!response.ok) {
          console.warn(`Album with ID ${albumId} not found.`);
          return null;
        }
  
        const albumData = await response.json();
        const images = albumData.images; 
  
    
        if (images && images.length > 0) {
          return images[0].url;
        } else {
          console.warn(`No album cover available for album with ID ${albumId}`);
          return null;
        }
      } catch (error) {
        console.error('Error fetching Album:', error);
        return null;
      }
    }
  }