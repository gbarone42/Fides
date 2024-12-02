
async function fetchConfirmedRoles() {
    const response = await fetch('http://localhost:3000/confirmed-roles', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const roles = await response.json();

    if (response.message === 'No roles found') {
        const rolesList = document.getElementById('confirmed-roles-list');
        rolesList.innerHTML = 'No confirmed role found';
        return;
    }

    const rolesList = document.getElementById('confirmed-roles-list');
    rolesList.innerHTML = '';

    roles.forEach(role => {
        const item = document.createElement('div');
        const formattedDate = new Date(role.date).toISOString().split('T')[0];

        item.textContent = `CONFIRMED --> ${role.role} - DATE: ${formattedDate} TIME: ${role.time} at ${role.place}`;

        //button to delete activity --> deleteAvailability(id)
        // item.innerHTML += `<button style="margin: 3px;" onclick="deleteAvailability(${availability.id})" style="display: block;">🗑️</button>`;

        rolesList.appendChild(item);
    });
}

fetchConfirmedRoles();
