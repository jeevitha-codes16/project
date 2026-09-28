export const fetchJSON = async (url) => {

    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to connect to the API."
        );
    }


    return response.json();
};