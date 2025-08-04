const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfD6XxQaH-_VUY425YdmehytiYOLMDxVBKHvAr-z6d_x29C5w/formResponse";
const formPointers = {
    title: 'entry.2005620554',
    flatNumber: 'entry.207535114',
    name: 'entry.1065046570',
    email: 'entry.1045781291',
    phone: 'entry.1166974658',
    author: 'entry.839337160',
    publishingHouse: 'entry.1484740013',
    genre: 'entry.730415916',
    edition: 'entry.1852618071',
    year: 'entry.1624577213',
    date_year: 'entry.561351992_year',
    date_month: 'entry.561351992_month',
    date_day: 'entry.561351992_day'
};

module.exports = async (request, response) => {
    try {
        const { date, title, flatNumber, name, email, phone, author, publishingHouse, genre, edition, year } = request.body;

        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1; // getMonth() is zero-based
        const fullYear = dateObj.getFullYear();

        const formParams = new URLSearchParams();
        formParams.append(formPointers.date_year, fullYear);
        formParams.append(formPointers.date_month, month);
        formParams.append(formPointers.date_day, day);
        formParams.append(formPointers.title, title);
        formParams.append(formPointers.flatNumber, flatNumber);
        formParams.append(formPointers.name, name);
        formParams.append(formPointers.email, email);
        formParams.append(formPointers.phone, phone);
        formParams.append(formPointers.author, author);
        formParams.append(formPointers.publishingHouse, publishingHouse);
        formParams.append(formPointers.genre, genre);
        formParams.append(formPointers.edition, edition);
        formParams.append(formPointers.year, year);

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