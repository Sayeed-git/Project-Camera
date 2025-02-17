// Function to show the current date and time
function updateDateTime() {
    const dateTimeElement = document.getElementById('dateTime');
    const now = new Date();
    const day = now.toLocaleString('en-us', { weekday: 'long' });
    const date = now.toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });
    dateTimeElement.innerText = `${day}, ${date}`;
}
setInterval(updateDateTime, 1000); // Update every second

// Function to access the camera feed
async function startCamera() {
    const videoElement = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;

        // Enable the start recording button
        document.getElementById('startBtn').disabled = false;
    } catch (err) {
        showError("Unable to access camera. Please check permissions.");
    }
}
startCamera();

// Display error message if camera access fails
function showError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = message;
    errorMessage.style.position = 'absolute';
    errorMessage.style.top = '50%';
    errorMessage.style.left = '50%';
    errorMessage.style.transform = 'translate(-50%, -50%)';
    errorMessage.style.padding = '20px';
    errorMessage.style.backgroundColor = '#f44336';
    errorMessage.style.color = '#fff';
    errorMessage.style.fontSize = '18px';
    errorMessage.style.borderRadius = '5px';
    errorMessage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

// Variables for recording
let mediaRecorder;
let recordedChunks = [];

// Start recording functionality
document.getElementById('startBtn').addEventListener('click', () => {
    const stream = document.getElementById('video').srcObject;
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('downloadBtn').addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = 'recording.webm';
            a.click();
        });
    };

    mediaRecorder.start();
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
});

// Stop recording functionality
document.getElementById('stopBtn').addEventListener('click', () => {
    mediaRecorder.stop();
    document.getElementById('stopBtn').disabled = true;
});
