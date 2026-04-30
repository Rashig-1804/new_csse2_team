---
---
/* eslint-disable */

// ^^ Front matter is first, then the linter disable comment.

export const baseurl = "{{ site.baseurl }}";

export var pythonURI;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    pythonURI = "http://localhost:8587"; // This matches your terminal!
} else {
    // This is the fallback if you ever put it online
    pythonURI = "https://flask-main-ai.onrender.com"; 
}

export var javaURI;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    javaURI = "http://localhost:8585";
} else {
    javaURI = "https://spring.opencodingsociety.com";
}

export const fetchOptions = {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'X-Origin': 'client'
    },
};

export function login(options) {
    const requestOptions  = {
        ...fetchOptions,
        method: options.method || 'POST',
        body: options.method === 'POST' ? JSON.stringify(options.body) : undefined
    };

    const msgBox = document.getElementById(options.message);
    if (msgBox) msgBox.textContent = "";

    fetch(options.URL, requestOptions)
    .then(response => {
        if (!response.ok) {
            if (msgBox) msgBox.textContent = 'Login error: ' + response.status;
            return response;
        }
        options.callback();
    })
    .catch(error => {
        console.error('Handshake failed:', error);
        if (msgBox) msgBox.textContent = 'Service Down error: ' + error;
    });
}