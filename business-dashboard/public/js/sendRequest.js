
// Send request WIP
async function sendRequest() {

    const emailData = {
        to: document.getElementById('to').value,
        subject: document.getElementById('subject').value,
        templateName,
        templateData
    };

    try {
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });

        const result = await response.json();

        status.textContent = result.success 
            ? 'Email sent successfully!' 
            : `Failed to send email: ${result.message}`;
        status.className = result.success ? 'success' : 'error';
        status.style.display = 'block';

    } catch (error) {
        status.textContent = `Error: ${error.message}`;
        status.className = 'error';
        status.style.display = 'block';
    } finally {
        // Re-enable button and hide loading
        button.disabled = false;
        loading.style.display = 'none';
    }
}
