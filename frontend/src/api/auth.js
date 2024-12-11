export function logOut() {
    if (
        document.querySelector('span.logout-mobile.menu-button').style.opacity == 1 ||
        document.querySelector('span.logout.menu-button').style.display != 'none' ||
        document.querySelector('.sidebar.open')
    ) {
        localStorage.removeItem('showPopup');
        //window.location.href = '/';
        // Clear cookies on the server side
        fetch('http://localhost:3000/logout', { credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    window.location.href = 'http://localhost:5173';
                }
            })
            .catch(error => console.error('Error logging out:', error));

        // Clear localStorage and sessionStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('device_id');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('years');

        // Clear cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }
}