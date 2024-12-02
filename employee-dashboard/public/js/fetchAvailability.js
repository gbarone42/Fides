
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
        item.classList.add('availability-item');

        const formattedDate = new Date(availability.date).toLocaleDateString();

        item.innerHTML = `<p><strong>Username:</strong> ${availability.username}</p> <p><strong>Date:</strong> ${formattedDate}</p> <p><strong>Time:</strong> ${availability.time}</p> <p><strong>Place:</strong> ${availability.place}</p>`;

        item.innerHTML += `<button onclick="searchMatchingAvailability(${availability.id})">Search matches</button>`;

        //button to delete activity --> deleteAvailability(id)
        item.innerHTML += `<button onclick="deleteAvailability(${availability.id})">Delete</button>`;

        availabilityList.appendChild(item);
    });
}
