const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfD6XxQaH-_VUY425YdmehytiYOLMDxVBKHvAr-z6d_x29C5w/formResponse";
const formPointers = {
    date: 'entry.207535114',
    title: 'entry.1065046570',
    flatNumber: 'entry.1166974658',
    name: 'entry.1045781291',
    email: 'entry.839337160',
    author: 'entry.1484740013',
    publisher: 'entry.1852618071',
    edition: 'entry.1624577213',
    genre: 'entry.730415916',
    phone: 'entry.1166974658'
};

module.exports = async (request, response) => {
    try {
        const { date, title, flatNumber, name, email, author, publisher, edition, genre, phone } = request.body;

        const formParams = new URLSearchParams();
        formParams.append(formPointers.date, date);
        formParams.append(formPointers.title, title);
        formParams.append(formPointers.flatNumber, flatNumber);
        formParams.append(formPointers.name, name);
        formParams.append(formPointers.email, email);
        formParams.append(formPointers.author, author);
        formParams.append(formPointers.publisher, publisher);
        formParams.append(formPointers.edition, edition);
        formParams.append(formPointers.genre, genre);
        formParams.append(formPointers.phone, phone);

        const formResponse = await fetch(googleFormUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        });
        
        if (formResponse.status >= 200 && formResponse.status < 400) {
            response.status(200).json({ success: true, message: 'Form submitted successfully.' });
        } else {
            response.status(formResponse.status).json({ success: false, error: 'Failed to submit to Google Form.' });
        }
        
    } catch (error) {
        console.error('Error submitting to Google Form:', error);
        response.status(500).json({ success: false, error: error.message });
    }
};