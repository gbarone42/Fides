
async function confirmRole(roleId, availabilityId) {

    try {

        const response = await fetch(`http://localhost:3000/confirm-role/${roleId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            alert('Role confirmed');
            searchMatchingAvailability(availabilityId);
        } else {
            alert('Failed to confirm role');
        }

    } catch(error) {
        console.error('Error confirming role:', error);
        alert('Failed to confirm role');
    }
}

async function refuseRole(roleId, availabilityId) {
    try {

        const response = await fetch(`http://localhost:3000/refuse-role/${roleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            alert('Role refused');
            searchMatchingAvailability(availabilityId);
        } else {
            alert('Failed to refuse role');
        }

    } catch(error) {
        console.error('Error refusing role:', error);
        alert('Failed to refuse role');
    }
}
