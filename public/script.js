// A. Initialization and UI Handling
const imageUpload = document.getElementById('image-upload');
const bookImagePreview = document.getElementById('book-image-preview');
const extractBtn = document.getElementById('extract-btn');
const donationForm = document.getElementById('donation-form');
const donorForm = document.getElementById('donor-form');
const submitFormBtn = document.getElementById('submit-form-btn');
const todaysDateInput = document.getElementById('todays-date');

// Your EmailJS credentials
const YOUR_EMAILJS_PUBLIC_KEY = 'aPsEgCkKhiXYR5VQW';
const YOUR_TEMPLATE_ID = 'template_abc456';
const YOUR_SERVICE_ID = 'service_gmail123';

// Set today's date
const today = new Date();
todaysDateInput.value = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Image preview handler
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        bookImagePreview.src = URL.createObjectURL(file);
        bookImagePreview.style.display = 'block';
        extractBtn.disabled = false;
    }
});

// B. OCR Functionality (Extract Button) - UPDATED
extractBtn.addEventListener('click', async () => {
    const imageFile = imageUpload.files[0];
    if (!imageFile) {
        alert('Please upload an image first.');
        return;
    }

    extractBtn.disabled = true;
    extractBtn.innerText = 'Extracting...';

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch('/api/ocr', {
            method: 'POST',
            body: formData,
        });

        const extractedData = await response.json();

        document.getElementById('book-title').value = extractedData.title || '';
        document.getElementById('book-author').value = extractedData.author || '';
        document.getElementById('book-edition').value = extractedData.edition || '';

        alert('Extraction complete. Please review the details and edit if necessary.');
    } catch (error) {
        console.error('Error during OCR extraction:', error);
        alert('An error occurred during OCR. Please try again.');
    } finally {
        extractBtn.disabled = false;
        extractBtn.innerText = 'Extract Title, Author & Edition';
    }
});

// C. Submission to Serverless Function
submitFormBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    if (!donationForm.checkValidity() || !donorForm.checkValidity()) {
        alert('Please fill in all the required fields.');
        return;
    }

    submitFormBtn.disabled = true;
    submitFormBtn.innerText = 'Submitting...';

    const formData = {
        date: todaysDateInput.value,
        title: document.getElementById('book-title').value,
        flatNumber: document.getElementById('flat-number').value,
        name: document.getElementById('donor-name').value,
        email: document.getElementById('donor-email').value,
        phone: document.getElementById('donor-phone').value,
        author: document.getElementById('book-author').value,
        publishingHouse: document.getElementById('book-publisher').value,
        edition: document.getElementById('book-edition').value,
        genre: document.getElementById('book-genre').value,
        year: document.getElementById('book-year').value
    };

    try {
        const response = await fetch('/api/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // D. EmailJS Integration
            emailjs.init(YOUR_EMAILJS_PUBLIC_KEY);
            const templateParams = {
                donor_name: formData.name,
                book_title: formData.title,
                email: formData.email,
            };

            await emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams);

            alert('Donation submitted successfully! A confirmation email has been sent to you.');
            // Reset the forms after a successful submission
            donationForm.reset();
            donorForm.reset();
            bookImagePreview.style.display = 'none';
        } else {
            throw new Error(result.error || 'Serverless function failed to submit.');
        }

    } catch (error) {
        console.error('Error submitting form or sending email:', error);
        alert('An error occurred. Please try again. Check the console for details.');
    } finally {
        submitFormBtn.disabled = false;
        submitFormBtn.innerText = 'Submit Donation';
    }
});