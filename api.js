export async function fetchJSON(url) {

    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `Request failed: ${response.status}`
        );

    }


    const data =
        await response.json();


    return data;
}