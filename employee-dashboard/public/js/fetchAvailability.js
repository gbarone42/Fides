
async function fetchAvailability() {
    const response = await fetch('http://localhost:3000/availability', {
        method: 'GET',
        credentials: 'include'
    });
    const availabilities = await response.json();

    if (response.message === 'No availability entries found') {
        const availabilityList = document.getElementById('availability-list');
        availabilityList.innerHTML = 'No availability entries found';
        return;
    }

    const availabilityList = document.getElementById('availability-list');
    availabilityList.innerHTML = '';

    availabilities.forEach(availability => {
        const item = document.createElement('div');

        item.textContent = `${availability.username} - ${availability.date} ${availability.time} at ${availability.place}`;

        item.innerHTML += `<button style="margin: 3px;" onclick="searchMatchingAvailability(${availability.id})" style="display: block;">Search matches</button>`;

        //button to delete activity --> deleteAvailability(id)
        item.innerHTML += `<button style="margin: 3px;" onclick="deleteAvailability(${availability.id})" style="display: block;">Delete</button>`;

        availabilityList.appendChild(item);
    });
}
