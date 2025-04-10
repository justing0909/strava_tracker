/* static/app.js */
document.addEventListener('DOMContentLoaded', function() {
    // Variables for pagination
    let currentPage = 1;
    const perPage = 10;
    
    // Elements
    const loadActivitiesBtn = document.getElementById('loadActivities');
    const activitiesList = document.getElementById('activitiesList');
    const loadingActivities = document.getElementById('loadingActivities');
    const paginationControls = document.getElementById('paginationControls');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const submitActivityBtn = document.getElementById('submitActivity');
    
    // Check if we're on the activities page
    if (loadActivitiesBtn) {
        // Load activities when button is clicked
        loadActivitiesBtn.addEventListener('click', function() {
            loadActivities(currentPage);
        });
        
        // Pagination event listeners
        if (prevPageBtn && nextPageBtn) {
            prevPageBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    loadActivities(currentPage);
                }
            });
            
            nextPageBtn.addEventListener('click', function() {
                currentPage++;
                loadActivities(currentPage);
            });
        }
    }
    
    // Create activity form submission
    if (submitActivityBtn) {
        submitActivityBtn.addEventListener('click', function() {
            createActivity();
        });
    }
    
    // Function to load activities
    function loadActivities(page) {
        // Show loading spinner
        if (loadingActivities) loadingActivities.style.display = 'block';
        if (activitiesList) activitiesList.innerHTML = '';
        
        // Update current page display
        if (currentPageSpan) currentPageSpan.textContent = page;
        
        // Make API request
        fetch(`/api/get_activities?page=${page}&per_page=${perPage}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Hide loading spinner
                if (loadingActivities) loadingActivities.style.display = 'none';
                
                // Show pagination controls if we have data
                if (paginationControls && data.length > 0) {
                    paginationControls.style.display = 'flex';
                }
                
                // Disable prev button on first page
                if (prevPageBtn) {
                    prevPageBtn.disabled = page === 1;
                }
                
                // Disable next button if we have less items than perPage
                if (nextPageBtn) {
                    nextPageBtn.disabled = data.length < perPage;
                }
                
                // Display activities
                displayActivities(data);
            })
            .catch(error => {
                console.error('Error fetching activities:', error);
                if (loadingActivities) loadingActivities.style.display = 'none';
                if (activitiesList) {
                    activitiesList.innerHTML = `
                        <div class="alert alert-danger">
                            Error loading activities. ${error.message}
                        </div>
                    `;
                }
            });
    }
    
    // Function to display activities
    function displayActivities(activities) {
        if (!activitiesList) return;
        
        if (activities.length === 0) {
            activitiesList.innerHTML = `
                <div class="alert alert-info">
                    No activities found.
                </div>
            `;
            return;
        }
        
        let activitiesHTML = '';
        
        activities.forEach(activity => {
            // Format distance (convert meters to km or miles)
            const distance = (activity.distance / 1000).toFixed(2);
            
            // Format date
            const date = new Date(activity.start_date_local);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            // Format duration (seconds to hours, minutes, seconds)
            const hours = Math.floor(activity.elapsed_time / 3600);
            const minutes = Math.floor((activity.elapsed_time % 3600) / 60);
            const seconds = activity.elapsed_time % 60;
            const formattedDuration = `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`;
            
            // Create activity card
            activitiesHTML += `
                <div class="list-group-item activity-card">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${activity.name}</h5>
                        <span class="badge bg-primary activity-type-badge">${activity.type}</span>
                    </div>
                    <p class="mb-1">${activity.description || 'No description'}</p>
                    <div class="activity-stats">
                        <div class="activity-stat">
                            <span class="activity-stat-value">${distance} km</span>
                            <span>Distance</span>
                        </div>
                        <div class="activity-stat">
                            <span class="activity-stat-value">${formattedDuration}</span>
                            <span>Duration</span>
                        </div>
                        <div class="activity-stat">
                            <span class="activity-stat-value">${activity.average_speed ? (activity.average_speed * 3.6).toFixed(1) + ' km/h' : 'N/A'}</span>
                            <span>Avg Speed</span>
                        </div>
                    </div>
                    <small class="activity-date">${formattedDate}</small>
                </div>
            `;
        });
        
        activitiesList.innerHTML = activitiesHTML;
    }
    
    // Function to create a new activity
    function createActivity() {
        const activityData = {
            name: document.getElementById('activityName').value,
            type: document.getElementById('activityType').value,
            sportType: document.getElementById('activityType').value,
            startDateLocal: document.getElementById('activityDate').value.replace('T', 'T') + ':00Z',
            elapsedTime: parseInt(document.getElementById('activityDuration').value),
            distance: parseFloat(document.getElementById('activityDistance').value),
            description: document.getElementById('activityDescription').value,
            trainer: document.getElementById('activityTrainer').checked ? 1 : 0,
            commute: document.getElementById('activityCommute').checked ? 1 : 0
        };
        
        fetch('/api/create_activity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activityData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('createActivityModal'));
            if (modal) modal.hide();
            
            // Show success message and reload activities
            alert('Activity created successfully!');
            loadActivities(currentPage);
        })
        .catch(error => {
            console.error('Error creating activity:', error);
            alert('Error creating activity: ' + error.message);
        });
    }
});