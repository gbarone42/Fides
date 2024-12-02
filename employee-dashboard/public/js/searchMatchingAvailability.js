
async function searchMatchingAvailability() {

    const response = await fetch(`http://localhost:4000/matching-availability/${activityId}`, {
        headers: {
            // 'Authorization': `Bearer ${token}`, //DO I need this?
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const availability = await response.json();
    const availabilityList = document.getElementById('matching-availability-list');
    availabilityList.innerHTML = '';

    

}