// Data Handling
let medicines = JSON.parse(localStorage.getItem('medicines')) || [];

// Search Functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMeds = medicines.filter(med => 
        med.name.toLowerCase().includes(searchTerm) ||
        med.use.toLowerCase().includes(searchTerm)
    );
    displayResults(filteredMeds);
});

// Modal Handling
const modal = document.getElementById('addModal');
document.getElementById('openModal').addEventListener('click', () => modal.style.display = 'flex');
document.getElementById('closeModal').addEventListener('click', () => {
    modal.style.display = 'none';
    document.getElementById('medicineForm').reset();
    document.getElementById('imagePreview').src = '#';
});

// Image Preview
document.getElementById('medImage').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('imagePreview').src = reader.result;
    }
    reader.readAsDataURL(this.files[0]);
});

// Form Submission
document.getElementById('medicineForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const reader = new FileReader();
    const imageFile = document.getElementById('medImage').files[0];
    
    reader.onload = function(e) {
        const newMedicine = {
            id: Date.now(),
            name: document.getElementById('medName').value,
            dosage: document.getElementById('medDosage').value,
            administration: document.getElementById('medAdministration').value,
            use: document.getElementById('medUse').value,
            image: e.target.result
        };

        medicines.push(newMedicine);
        localStorage.setItem('medicines', JSON.stringify(medicines));
        displayResults(medicines);
        modal.style.display = 'none';
        this.reset();
        showNotification('Medicine added successfully!');
    }.bind(this);

    reader.readAsDataURL(imageFile);
});

// Display Results
function displayResults(meds) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    meds.forEach(med => {
        const medCard = document.createElement('div');
        medCard.className = 'medicine-card';
        medCard.innerHTML = `
            ${med.image ? <img src="${med.image}" class="medicine-image" alt="${med.name}"> : ''}
            <h3 style="margin-bottom: 0.5rem;">${med.name}</h3>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="background: #EFF6FF; color: var(--primary); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">${med.administration}</span>
                <span style="background: #F0FDF4; color: #15803D; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">${med.dosage}</span>
            </div>
            <p style="font-size: 0.875rem; color: #64748B;">${med.use}</p>
        `;
        resultsDiv.appendChild(medCard);
    });
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '1rem';
    notification.style.right = '1rem';
    notification.style.background = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '0.5rem';
    notification.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initial Load
displayResults(medicines);