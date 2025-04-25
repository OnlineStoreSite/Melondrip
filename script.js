// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Create watermelon emojis
    createMelons();
    
    // Initialize parallax effect
    initParallax();
    
    // Initialize scroll reveal
    initScrollReveal();
    
    // Initialize audio player
    initAudioPlayer();
    
    // Initialize cart functionality
    initCartFunctionality();
    
    // Add event listener for cart button
    document.getElementById('cart-button').addEventListener('click', function() {
        window.location.href = 'checkout.html';
    });
    
    // Add event listener for account button
    document.getElementById('account-button').addEventListener('click', function() {
        alert('Account functionality coming soon!');
    });
});

// Watermelon emojis floating animation
function createMelons() {
    const container = document.querySelector('.melon-container');
    const viewportWidth = window.innerWidth;
    const melonCount = viewportWidth < 768 ? 5 : 8;
    
    for (let i = 0; i < melonCount; i++) {
        const melon = document.createElement('div');
        melon.className = 'melon';
        melon.textContent = '🍉';
        
        // Random horizontal position
        const leftPos = Math.random() * 90 + 5; // 5% to 95% from left
        melon.style.left = `${leftPos}%`;
        
        // Random animation duration between 8 and 12 seconds
        const duration = Math.random() * 4 + 8;
        melon.style.animationDuration = `${duration}s`;
        
        // Random delay up to 15 seconds
        const delay = Math.random() * 15;
        melon.style.animationDelay = `${delay}s`;
        
        // Add to container
        container.appendChild(melon);
        
        // Restart animation when complete
        melon.addEventListener('animationend', function() {
            // Remove and re-add to restart animation with new random positions
            this.remove();
            setTimeout(() => {
                const newMelon = document.createElement('div');
                newMelon.className = 'melon';
                newMelon.textContent = '🍉';
                
                const newLeftPos = Math.random() * 90 + 5;
                newMelon.style.left = `${newLeftPos}%`;
                
                const newDuration = Math.random() * 4 + 8;
                newMelon.style.animationDuration = `${newDuration}s`;
                
                container.appendChild(newMelon);
            }, Math.random() * 2000); // Random delay before reappearing
        });
    }
}

// Parallax scrolling effect
function initParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        
        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed') || 0.2;
            const yPos = scrollY * speed;
            layer.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateParallax);
    // Initial update
    updateParallax();
}

// Scroll reveal animation with IntersectionObserver
function initScrollReveal() {
    const sections = document.querySelectorAll('.reveal-section');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px'
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    }, revealOptions);
    
    sections.forEach(section => {
        revealObserver.observe(section);
    });
}

// Audio player functionality
function initAudioPlayer() {
    const audioToggle = document.getElementById('audio-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    const audioElement = document.getElementById('background-music');
    
    // Set initial volume
    audioElement.volume = volumeSlider.value;
    
    // Add music player notification
    const notification = document.createElement('div');
    notification.className = 'music-notification';
    notification.innerHTML = '<span>Press to enjoy the vibe</span>';
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }, 2000);
    
    // Toggle play/pause with visual feedback
    audioToggle.addEventListener('click', function() {
        if (audioElement.paused) {
            // Add loading state
            audioToggle.classList.add('is-loading');
            
            audioElement.play()
                .then(() => {
                    audioToggle.classList.remove('is-loading');
                    audioToggle.classList.add('is-playing');
                    
                    // Add playing animation to the audio player
                    document.querySelector('.audio-player').classList.add('is-active');
                    
                    // Show now playing notification
                    const playingNotification = document.createElement('div');
                    playingNotification.className = 'music-notification playing';
                    playingNotification.innerHTML = '<span>Now playing: Summer Vibes</span>';
                    document.body.appendChild(playingNotification);
                    
                    setTimeout(() => {
                        playingNotification.classList.add('show');
                        setTimeout(() => {
                            playingNotification.classList.remove('show');
                            setTimeout(() => {
                                playingNotification.remove();
                            }, 500);
                        }, 2000);
                    }, 300);
                })
                .catch(error => {
                    console.error('Audio playback failed:', error);
                    audioToggle.classList.remove('is-loading');
                    
                    // Show error notification
                    const errorNotification = document.createElement('div');
                    errorNotification.className = 'music-notification error';
                    errorNotification.innerHTML = '<span>Couldn\'t load music track</span>';
                    document.body.appendChild(errorNotification);
                    
                    setTimeout(() => {
                        errorNotification.classList.add('show');
                        setTimeout(() => {
                            errorNotification.classList.remove('show');
                            setTimeout(() => {
                                errorNotification.remove();
                            }, 500);
                        }, 3000);
                    }, 300);
                });
        } else {
            audioElement.pause();
            audioToggle.classList.remove('is-playing');
            document.querySelector('.audio-player').classList.remove('is-active');
        }
    });
    
    // Volume control with visual feedback
    volumeSlider.addEventListener('input', function() {
        audioElement.volume = this.value;
        
        // Update volume icon/indicator
        const volume = parseFloat(this.value);
        if (volume === 0) {
            audioToggle.classList.add('is-muted');
        } else {
            audioToggle.classList.remove('is-muted');
        }
    });
    
    // Handle audio errors
    audioElement.addEventListener('error', function(e) {
        console.error('Error loading audio file:', e);
        audioToggle.disabled = true;
        audioToggle.classList.add('has-error');
    });
    
    // Handle audio ended (loop manually for better control)
    audioElement.addEventListener('ended', function() {
        // Restart the audio
        audioElement.currentTime = 0;
        audioElement.play().catch(error => {
            console.error('Failed to restart audio:', error);
        });
    });
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .music-notification {
            position: fixed;
            bottom: 110px;
            left: 50%;
            transform: translateX(-50%) translateY(30px);
            background: rgba(61, 30, 109, 0.9);
            color: var(--cream);
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 0.9rem;
            z-index: 100;
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .music-notification.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        
        .music-notification.playing {
            background: linear-gradient(135deg, var(--green), var(--twilight));
        }
        
        .music-notification.error {
            background: linear-gradient(135deg, #d32f2f, var(--twilight));
        }
        
        .is-loading {
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }
        
        .audio-player.is-active {
            border-color: rgba(241, 121, 95, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// Handle resize events
window.addEventListener('resize', function() {
    // Clear and recreate melons on significant resize
    const container = document.querySelector('.melon-container');
    if (container) {
        // Only recreate if significant change in viewport width
        if (Math.abs(window.innerWidth - this.lastWidth) > 200) {
            container.innerHTML = '';
            createMelons();
            this.lastWidth = window.innerWidth;
        }
    }
});

// Store initial width
window.lastWidth = window.innerWidth;

// Shopping cart functionality
function initCartFunctionality() {
    // Initialize cart in localStorage if it doesn't exist
    if (!localStorage.getItem('melondripCart')) {
        localStorage.setItem('melondripCart', JSON.stringify([]));
    }
    
    // Update cart badge with the number of items in cart
    updateCartBadge();
    
    // Add event listeners to all buy buttons
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('.product-thumbnail').getAttribute('src');
            
            // Add item to cart
            addToCart({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            
            // Show notification
            showNotification(`${productName} added to cart!`, 'success');
            
            // Update cart badge
            updateCartBadge();
        });
    });
}

// Add item to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('melondripCart'));
    
    // Check if product already in cart
    const existingProduct = cart.find(item => item.name === product.name);
    
    if (existingProduct) {
        // Update quantity if product exists
        existingProduct.quantity += product.quantity;
    } else {
        // Add new product to cart
        cart.push(product);
    }
    
    // Save updated cart
    localStorage.setItem('melondripCart', JSON.stringify(cart));
}

// Update cart badge with number of items
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    const cart = JSON.parse(localStorage.getItem('melondripCart') || '[]');
    
    // Calculate total quantity
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update badge
    cartBadge.textContent = totalItems;
    
    // Toggle visibility
    if (totalItems > 0) {
        cartBadge.classList.add('has-items');
    } else {
        cartBadge.classList.remove('has-items');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
        
        // Animate out
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2000);
    }, 100);
    
    // Add CSS for notifications if it doesn't exist
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--twilight);
                color: var(--cream);
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                border-left: 3px solid var(--gold);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                border-left-color: var(--green);
            }
            
            .notification.error {
                border-left-color: #d32f2f;
            }
        `;
        document.head.appendChild(style);
    }
}
