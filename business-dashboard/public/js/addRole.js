
let toggleForm = false;  // To toggle the form display

function addRole(activityId) {

    if (toggleForm) {
        const roleDiv = document.querySelector(`div[data-role-form="${activityId}"]`);
        roleDiv.innerHTML = `<button style="margin: 3px; display: block;" data-role-id="roleBtn" onclick="addRole(${activityId})">Add role</button>`;
        roleDiv.style.padding = '0'; // Reset padding
        toggleForm = false;
        return;
    }

    toggleForm = true;

    const roleDiv = document.querySelector(`div[data-role-form="${activityId}"]`);

    // Create unique ids for each form
    const roleId = 'role' + activityId;
    const roleTimeId = 'roleTime' + activityId;
    const roleDescriptionId = 'roleDescription' + activityId;

    // Create a new div to hold the form
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <form style="padding: 10px;" onsubmit="event.preventDefault()">
        <label for="role">Role:</label>
        <input type="text" id="${roleId}" name="role" autocomplete="off" required><br>
        <label for="roleDescription">Description:</label>
        <input type="text" id="${roleDescriptionId}" name="roleDescription" autocomplete="off" required><br>
        <label for="time">Time:</label>
        <input type="time" id="${roleTimeId}" name="time" required><br>
        <button onclick="roleForm(${activityId})">Submit</button>
        </form>`;

    roleDiv.appendChild(formContainer);
    roleDiv.style.padding = '10px';
}
