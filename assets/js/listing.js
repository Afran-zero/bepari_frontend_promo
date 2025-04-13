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
    const compareCloseBtn = compareModal.querySelector('.btn-close');
    const compareClearBtn = compareModal.querySelector('.btn-outline-secondary');
    const compareContinueBtn = compareModal.querySelector('.btn-primary');
    
    let comparedProjects = [];
    
    // Initialize comparison buttons
    document.querySelectorAll('.btn-action .fa-balance-scale').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.project-card');
            const projectId = card.dataset.id || card.querySelector('h3').textContent;
            
            // Get project details
            const projectDetails = {
                id: projectId,
                name: card.querySelector('h3').textContent,
                roi: card.querySelector('.project-meta strong:nth-child(1)').textContent,
                minInvest: card.querySelector('.project-meta strong:nth-child(2)').textContent,
                duration: card.querySelector('.project-meta strong:nth-child(3)').textContent,
                location: card.querySelector('.location').textContent,
                progress: card.querySelector('.progress-value').textContent,
                badges: Array.from(card.querySelectorAll('.card-badges .badge')).map(b => b.textContent.trim())
            };
            
            // Toggle project in comparison
            const index = comparedProjects.findIndex(p => p.id === projectId);
            if (index >= 0) {
                // Remove from comparison
                comparedProjects.splice(index, 1);
                this.classList.remove('active');
            } else {
                // Add to comparison (max 3)
                if (comparedProjects.length < 3) {
                    comparedProjects.push(projectDetails);
                    this.classList.add('active');
                } else {
                    alert('You can compare a maximum of 3 projects');
                    return;
                }
            }
            
            updateCompareUI();
        });
    });
    
    // Open comparison modal
    compareFab.addEventListener('click', function() {
        if (comparedProjects.length > 0) {
            updateComparisonTable();
            compareModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Close modal
    compareCloseBtn.addEventListener('click', closeCompareModal);
    compareModal.addEventListener('click', function(e) {
        if (e.target === this) closeCompareModal();
    });
    
    // Clear comparison
    compareClearBtn.addEventListener('click', function() {
        comparedProjects = [];
        document.querySelectorAll('.btn-action .fa-balance-scale').forEach(btn => {
            btn.classList.remove('active');
        });
        updateCompareUI();
        closeCompareModal();
    });
    
    // Continue button
    compareContinueBtn.addEventListener('click', function() {
        // Add your "continue to invest" logic here
        alert('Redirecting to investment page...');
        closeCompareModal();
    });
    
    function updateCompareUI() {
        const compareBadge = compareFab.querySelector('.badge');
        compareBadge.textContent = `${comparedProjects.length}/3`;
        
        // Show/hide FAB based on items
        if (comparedProjects.length > 0) {
            compareFab.style.display = 'block';
        } else {
            compareFab.style.display = 'none';
        }
    }
    
    function updateComparisonTable() {
        const tableBody = compareModal.querySelector('tbody');
        tableBody.innerHTML = '';
        
        // Add comparison rows
        addComparisonRow('Project', comparedProjects.map(p => p.name));
        addComparisonRow('ROI', comparedProjects.map(p => p.roi));
        addComparisonRow('Min. Investment', comparedProjects.map(p => p.minInvest));
        addComparisonRow('Duration', comparedProjects.map(p => p.duration));
        addComparisonRow('Location', comparedProjects.map(p => p.location));
        addComparisonRow('Funding Progress', comparedProjects.map(p => p.progress));
        addComparisonRow('Tags', comparedProjects.map(p => p.badges.join(', ')));
        
        // Update counter in modal title
        compareModal.querySelector('.compare-count').textContent = comparedProjects.length;
    }
    
    function addComparisonRow(metric, values) {
        const row = document.createElement('tr');
        const metricCell = document.createElement('td');
        metricCell.textContent = metric;
        row.appendChild(metricCell);
        
        values.forEach(value => {
            const valueCell = document.createElement('td');
            valueCell.textContent = value || '-';
            row.appendChild(valueCell);
        });
        
        // Fill empty cells if less than 3 projects
        for (let i = values.length; i < 3; i++) {
            const emptyCell = document.createElement('td');
            emptyCell.innerHTML = '<span class="text-muted">-</span>';
            row.appendChild(emptyCell);
        }
        
        compareModal.querySelector('tbody').appendChild(row);
    }
    
    function closeCompareModal() {
        compareModal.classList.remove('active');
        document.body.style.overflow = '';
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