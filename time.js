// current date
const currentDate = new Date();

// Format DDMMYYYY
const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
};

// Format using en-GB
const formattedDate = currentDate.toLocaleDateString('en-GB', options);

// Set 
document.getElementById('current-date').textContent = formattedDate; 
