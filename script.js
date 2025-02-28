// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Subtle animation for page load
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.transition = 'opacity 1.5s ease';
        document.body.style.opacity = 1;
    }, 200);
    
    // Track blog visit (if URL parameter exists)
    const urlParams = new URLSearchParams(window.location.search);
    const playerEmail = urlParams.get('player');
    
    if (playerEmail) {
        // Replace the tracking pixel with the actual player email
        const trackingPixel = document.querySelector('img[src*="blog-visit"]');
        if (trackingPixel) {
            trackingPixel.src = trackingPixel.src.replace('[PLAYER_EMAIL]', encodeURIComponent(playerEmail));
        }
        
        // Store in local storage to maintain across pages
        localStorage.setItem('player_email', playerEmail);
    } else {
        // Try to get from localStorage
        const storedEmail = localStorage.getItem('player_email');
        if (storedEmail) {
            const trackingPixel = document.querySelector('img[src*="blog-visit"]');
            if (trackingPixel) {
                trackingPixel.src = trackingPixel.src.replace('[PLAYER_EMAIL]', encodeURIComponent(storedEmail));
            }
        }
    }
    
    // Easter egg - konami code reveals hidden message
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Reveal hidden message
                const secretDiv = document.createElement('div');
                secretDiv.style.position = 'fixed';
                secretDiv.style.top = '20px';
                secretDiv.style.left = '50%';
                secretDiv.style.transform = 'translateX(-50%)';
                secretDiv.style.padding = '10px';
                secretDiv.style.backgroundColor = '#a70000';
                secretDiv.style.color = '#fff';
                secretDiv.style.zIndex = '1000';
                secretDiv.innerText = 'THE CLOCK TOWER HOLDS THE KEY';
                document.body.appendChild(secretDiv);
                
                setTimeout(() => {
                    document.body.removeChild(secretDiv);
                }, 5000);
                
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
});
