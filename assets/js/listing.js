// assets/js/listing.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initFilterPanel();
    initComparisonTool();
    initProgressCircles();
    initSearchFunctionality();
    initEmptyStates();
    initTrustIndicators();
});

/* ========== FILTER PANEL ========== */
function initFilterPanel() {
    const filterBtn = document.getElementById('advancedFilterBtn');
    const closeBtn = document.getElementById('closeFilterPanel');
    const filterPanel = document.querySelector('.advanced-filter-panel');
    const roiMin = document.getElementById('roiMin');
    const roiMax = document.getElementById('roiMax');
    const roiValue = document.getElementById('roiValue');

    // Toggle filter panel
    filterBtn.addEventListener('click', () => {
        filterPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
        filterPanel.classList.remove('active');
        document.body.style.overflow = '';
    });

    // ROI range slider
    function updateRoiValue() {
        roiValue.textContent = `${roiMin.value}% - ${roiMax.value}%`;
    }

    roiMin.addEventListener('input', updateRoiValue);
    roiMax.addEventListener('input', updateRoiValue);
    updateRoiValue(); // Initialize

    // Risk tolerance buttons
    const riskBtns = document.querySelectorAll('.filter-section .btn-group .btn');
    riskBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            riskBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/* ========== COMPARISON TOOL ========== */
function initComparisonTool() {
    const compareFab = document.querySelector('.comparison-fab');
    const compareModal = document.querySelector('.comparison-modal');
    const compareBtns = document.querySelectorAll('.btn-action .fa-balance-scale');
    const closeModal = compareModal.querySelector('.btn-close');
    let comparedProjects = [];

    // FAB click
    compareFab.addEventListener('click', () => {
        if (comparedProjects.length > 0) {
            compareModal.classList.add('active');
        } else {
            // Show tooltip or message
            alert('Select at least 1 project to compare');
        }
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        compareModal.classList.remove('active');
    });

    // Compare button clicks
    compareBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const card = this.closest('.project-card');
            const projectId = card.dataset.id || index;
            
            if (comparedProjects.includes(projectId)) {
                // Remove if already in comparison
                comparedProjects = comparedProjects.filter(id => id !== projectId);
                this.classList.remove('active');
            } else if (comparedProjects.length < 3) {
                // Add to comparison
                comparedProjects.push(projectId);
                this.classList.add('active');
            } else {
                alert('Maximum 3 projects can be compared');
            }
            
            // Update FAB counter
            updateCompareCounter();
        });
    });

    function updateCompareCounter() {
        const counter = compareFab.querySelector('.badge');
        counter.textContent = `${comparedProjects.length}/3`;
        
        // Disable FAB if empty
        if (comparedProjects.length === 0) {
            compareFab.classList.add('disabled');
        } else {
            compareFab.classList.remove('disabled');
        }
    }
}

/* ========== PROGRESS CIRCLES ========== */
function initProgressCircles() {
    const circles = document.querySelectorAll('.circular-progress');
    
    circles.forEach(circle => {
        const progressValue = circle.querySelector('.progress-value');
        const progressRing = circle.querySelector('.progress-ring-circle');
        const value = parseInt(circle.dataset.value);
        
        // Calculate dashoffset
        const circumference = 2 * Math.PI * 26; // r="26" in SVG
        const offset = circumference - (value / 100) * circumference;
        
        // Set initial styles
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = offset;
        progressValue.textContent = `${value}%`;
        
        // Store values for possible animation later
        circle.dataset.circumference = circumference;
        circle.dataset.offset = offset;
    });
}

/* ========== SEARCH & FILTERS ========== */
function initSearchFunctionality() {
    const searchInput = document.getElementById('projectSearch');
    const filterPills = document.querySelectorAll('.btn-pill');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Search input handler
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const location = card.querySelector('.location').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || location.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        checkEmptyState();
    });
    
    // Pill filter handler
    filterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            this.classList.toggle('active');
            applyFilters();
        });
    });
    
    function applyFilters() {
        const activeRoiPills = document.querySelectorAll('.pill-group:nth-child(1) .btn-pill.active');
        const activeStagePills = document.querySelectorAll('.pill-group:nth-child(2) .btn-pill.active');
        
        projectCards.forEach(card => {
            const roi = parseInt(card.querySelector('.project-meta strong:nth-child(1)').textContent);
            const stage = card.dataset.stage || 'active'; // Assuming data-stage attribute
            
            // ROI filter
            let roiMatch = activeRoiPills.length === 0;
            if (!roiMatch) {
                activeRoiPills.forEach(pill => {
                    if (pill.textContent.includes('High') && roi >= 20) roiMatch = true;
                    if (pill.textContent.includes('Medium') && roi >= 10 && roi < 20) roiMatch = true;
                    if (pill.textContent.includes('All')) roiMatch = true;
                });
            }
            
            // Stage filter
            let stageMatch = activeStagePills.length === 0;
            if (!stageMatch) {
                activeStagePills.forEach(pill => {
                    if (pill.textContent.toLowerCase().includes(stage.toLowerCase())) stageMatch = true;
                    if (pill.textContent.includes('All')) stageMatch = true;
                });
            }
            
            card.style.display = (roiMatch && stageMatch) ? 'block' : 'none';
        });
        
        checkEmptyState();
    }
    
    function checkEmptyState() {
        const visibleCards = document.querySelectorAll('.project-card[style="display: block"]');
        const emptyState = document.querySelector('.empty-state');
        
        if (visibleCards.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }
}

/* ========== EMPTY STATES ========== */
function initEmptyStates() {
    const emptyStateBtns = document.querySelectorAll('.empty-state .btn');
    
    emptyStateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('ROI')) {
                // Reset ROI filters
                document.querySelectorAll('.pill-group:nth-child(1) .btn-pill').forEach(pill => {
                    pill.classList.add('active');
                });
            }
            // Add more specific actions as needed
            applyFilters();
        });
    });
}

/* ========== TRUST INDICATORS ========== */
function initTrustIndicators() {
    // Animate investor counter
    const investorCount = document.querySelector('.investor-count');
    const targetCount = 5247;
    let currentCount = 0;
    const duration = 3000; // 3 seconds
    const increment = targetCount / (duration / 16); // 60fps
    
    const animateCounter = () => {
        currentCount += increment;
        if (currentCount < targetCount) {
            investorCount.innerHTML = `<i class="fas fa-users"></i> ${Math.floor(currentCount).toLocaleString()} investors`;
            requestAnimationFrame(animateCounter);
        } else {
            investorCount.innerHTML = `<i class="fas fa-users"></i> ${targetCount.toLocaleString()} investors`;
        }
    };
    
    // Start animation when element is in viewport
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounter();
            observer.unobserve(investorCount);
        }
    });
    
    observer.observe(investorCount);
    
    // Simulate live ticker updates
    const ticker = document.querySelector('.live-ticker');
    const investments = [
        { amount: 500, user: 'User_42', time: '2min ago' },
        { amount: 1000, user: 'User_17', time: '5min ago' },
        { amount: 250, user: 'User_89', time: '7min ago' },
        { amount: 750, user: 'User_23', time: '12min ago' }
    ];
    
    let tickerIndex = 0;
    setInterval(() => {
        const { amount, user, time } = investments[tickerIndex];
        ticker.innerHTML = `<i class="fas fa-bolt"></i> Last: $${amount} by ${user} (${time})`;
        tickerIndex = (tickerIndex + 1) % investments.length;
    }, 5000);
}