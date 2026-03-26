async function testLogin() {
    try {
        const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@mmps.com',
                password: 'password123'
            })
        });
        const data = await res.json();
        if (res.ok) {
            console.log("Login Success! Response:", data);
        } else {
            console.error("Login Failed!", data);
        }
    } catch (err) {
        console.error("Fetch Error!", err.message);
    }
}

testLogin();
