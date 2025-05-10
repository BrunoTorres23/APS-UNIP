document.addEventListener('DOMContentLoaded', function() {
    // Horizontal timeline scroll functionality
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    
    if (timelineWrapper) {
        // Add arrow navigation for desktop
        const timelineContainer = document.querySelector('.timeline-container');
        
        // Create navigation arrows
        const prevArrow = document.createElement('button');
        prevArrow.className = 'timeline-nav prev';
        prevArrow.innerHTML = '<i class="bi bi-chevron-left"></i>';
        prevArrow.setAttribute('aria-label', 'Anterior');
        
        const nextArrow = document.createElement('button');
        nextArrow.className = 'timeline-nav next';
        nextArrow.innerHTML = '<i class="bi bi-chevron-right"></i>';
        nextArrow.setAttribute('aria-label', 'Próximo');
        
        // Only add arrows on desktop
        if (window.innerWidth > 768) {
            timelineContainer.appendChild(prevArrow);
            timelineContainer.appendChild(nextArrow);
            
            // Scroll functionality
            const scrollAmount = 340; // Width of item + gap
            
            prevArrow.addEventListener('click', function() {
                timelineWrapper.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });
            
            nextArrow.addEventListener('click', function() {
                timelineWrapper.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
            
            // Show/hide arrows based on scroll position
            timelineWrapper.addEventListener('scroll', function() {
                // Show/hide prev arrow
                if (timelineWrapper.scrollLeft <= 10) {
                    prevArrow.classList.add('hidden');
                } else {
                    prevArrow.classList.remove('hidden');
                }
                
                // Show/hide next arrow
                if (timelineWrapper.scrollLeft >= (timelineWrapper.scrollWidth - timelineWrapper.clientWidth - 10)) {
                    nextArrow.classList.add('hidden');
                } else {
                    nextArrow.classList.remove('hidden');
                }
            });
            
            // Initial check
            if (timelineWrapper.scrollLeft <= 10) {
                prevArrow.classList.add('hidden');
            }
        }
    }
});