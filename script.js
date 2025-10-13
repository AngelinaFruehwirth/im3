async function getAll() {
    const url = 'https://im3.angelina-fruehwirth.ch/backend/api/getAll.php';
    try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data); // gibt die Daten der API in der Konsole aus
    } catch (error) {
    console.error(error)
    }

}

getAll(); 