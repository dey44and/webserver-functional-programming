onmessage = (e) => {
    console.log(`Worker: Adding element ${e.data[0]} to the list`);
    postMessage("ok");
}