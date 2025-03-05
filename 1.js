let id = null;  // Declare `id` outside of the promise chain

fetch("https://dev1.dev.clover.com/v3/accounts/current/business-topology", {
    method: "GET",
    credentials: "include"
})
.then(response => response.json())
.then(data => {
    // Extract ID
    if (data.unaffiliated && data.unaffiliated.elements.length > 0) {
        id = data.unaffiliated.elements[0].id;  // Store ID in the outer variable
        console.log("Extracted ID:", id);

        // Send the second request to extract csrfToken
        return fetch("https://dev1.dev.clover.com/v3/accounts/current", {
            method: "GET",
            credentials: "include"
        });
    } else {
        throw new Error("No ID found in 'unaffiliated.elements'");
    }
})
.then(response => response.json())
.then(data => {
    // Extract CSRF Token
    if (data.csrfToken) {
        console.log("Extracted CSRF Token:", data.csrfToken);
        
        // Prepare the PUT request body
        const requestBody = {
            uuid: "HS9QV1NWB5GFE",
            name: "ATO admin",
            nickname: "ato admin",
            customId: "",
            email: "hacker.kurda+atoom@gmail.com",
            phone: "",
            pin: "754645",
            role: "ADMIN",
            roles: {
                elements: [
                    { id: "Q07N53FJB5DAA" }
                ]
            },
            wageRate: 12.22,
            payType: "HOURLY"
        };

        // Send the PUT request
        return fetch(`https://dev1.dev.clover.com/employees-microservice/v1/merchants/${id}/employees/HS9QV1NWB5GFE?expand=roles`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Csrf-Token": data.csrfToken
            },
            body: JSON.stringify(requestBody)
        });
    } else {
        throw new Error("CSRF Token not found.");
    }
})
.then(response => response.json())
.then(responseData => {
    console.log("PUT Request Response:", responseData);
})
.catch(error => console.error("Error:", error));
