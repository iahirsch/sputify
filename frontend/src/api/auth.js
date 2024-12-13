export function logOut() {
    if (
        document.querySelector('span.logout-mobile.menu-button').style.opacity == 1 ||
        document.querySelector('span.logout.menu-button').style.display != 'none' ||
        document.querySelector('.sidebar.open')
    ) {
        localStorage.removeItem('showPopup');
        // Clear cookies on the server side
        fetch('https://astonishing-llama-76e306.netlify.app/logout', { credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    const logoutUrl = 'https://accounts.spotify.com/en/logout';
                    // Clear localStorage and sessionStorage
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('device_id');
                    sessionStorage.removeItem('userName');
                    sessionStorage.removeItem('years');

                    // Redirect to Spotify logout and then to localhost
                    const spotifyLogoutWindow = window.open(logoutUrl, 'Spotify Logout', 'width=1,height=1');
                    setTimeout(() => {
                        spotifyLogoutWindow.close();
                        window.location.href = 'http://localhost:5173';
                    }, 500);
                }
            })
            .catch(error => console.error('Error logging out:', error));

        // Clear cookies
        // document.cookie.split(";").forEach((c) => {
        //     document.cookie = c
        //         .replace(/^ +/, "")
        //         .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        // });
    }
}