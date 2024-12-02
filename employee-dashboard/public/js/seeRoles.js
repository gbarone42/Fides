let toggleSeeRoles = false;

async function seeRoles(activityId, availabilityId) {

    if (toggleSeeRoles) {
        searchMatchingAvailability(availabilityId);
        toggleSeeRoles = false;
        return;
    }

    toggleSeeRoles = true;

    try {

        const response = await fetch(`http://localhost:3000/matching-roles/${activityId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const roles = await response.json();

        if (roles.message === 'No matches found') {
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'No roles found';
            document.querySelector(`div[data-activity-match-id="${activityId}"]`).appendChild(errorMessage);
            return;
        }

        const rolesList = document.querySelector(`div[data-activity-match-id="${activityId}"]`);
        // rolesList.innerHTML = '';

        roles.forEach(role => {
            const item = document.createElement('div');

            item.style.paddingLeft = '10px';
            item.style.paddingTop = '5px';

            item.textContent = `ROLE FOUND --> ROLE: ${role.role} - DESCRITPION: ${role.description} - STATUS: ${role.status}`;

            // Confirm
            item.innerHTML += `<button onclick="confirmRole(${role.id}, ${availabilityId})">Confirm role</button>`;
            // Refuse
            item.innerHTML += `<button onclick="refuseRole(${role.id}, ${availabilityId})">Refuse role</button>`;

            rolesList.appendChild(item);
        });

    } catch(error) {
        console.error('Error fetching roles:', error);
    }
}