importScripts("https://progressier.app/i1qF8yOXOQyt7A63daZZ/sw.js");
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("SW Registered!");
        console.log(registration);
    }).catch(error => {
        console.log("SW Registration failed!");
        console.log(error);
    })
}