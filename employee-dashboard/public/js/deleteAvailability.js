
async function deleteAvailability(availabilityId) {
    await fetch(`http://localhost:3000/availability/${availabilityId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    fetchAvailability();
}
