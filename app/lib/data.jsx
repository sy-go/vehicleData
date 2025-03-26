



export async function vehiclfetchDVLA(registrationNumber) {
    const url= process.env.DVLA_API_URL;
    const apiKey = process.env.DVLA_API_KEY;

    try {
        const dvlaResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ registrationNumber }),
        })

        if (!dvlaResponse.ok) {
            throw new Error('Failed to fetch DVLA data');
        }

        const dvlaData = await dvlaResponse.json();
        console.log(dvlaData)
        return dvlaData;

    }
    catch (error) {
        console.error(error);
    }
}

export const fetchDVLA = async (reg) => {
    const apiurl = process.env.DVLA_API_URL;
    const apiKey = process.env.DVLA_API_KEY;
    try {
        const response = fetch(apiurl,
            {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reg }),
            })

            if(response.ok){
                const reponseData = await response.json();
                return reponseData;
            }
    }
    catch (error) {
        console.log(error)
    }
}