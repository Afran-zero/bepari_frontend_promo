// assets/js/animations.js
document.addEventListener('DOMContentLoaded', function() {
    // 3D tilt effect for project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 15;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 15;
            card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    });
    
    // Load more animation
    const loadMoreBtn = document.querySelector('.load-more-container .btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Loading...';
            // Simulate AJAX load
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-redo me-2"></i> Load Next 6 Projects';
                // In real implementation, you would append new projects here
            }, 1500);
        });
    }
});