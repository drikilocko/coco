async function test() {
    try {
        const response = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', text: 'Bonjour, proposez-vous des mariages au Togo ?' }]
            })
        });
        const data = await response.json();
        console.log('HTTP:', response.status);
        console.log('Response:', data);
    } catch (e) {
        console.error(e);
    }
}
test();
