
async function fetchAvailability() {
    const response = await fetch('http://localhost:3000/availability');
    const availabilities = await response.json();
    const availabilityList = document.getElementById('availability-list');
    availabilityList.innerHTML = '';

    availabilities.forEach(availability => {
        const item = document.createElement('div');
        item.textContent = `${availability.username} - ${availability.date} ${availability.time} at ${availability.place}`;
        availabilityList.appendChild(item);
    });
}
