async function getByDate(date){
    const url = `https://im3.angelina-fruehwirth.ch/backend/api/getByDate.php?date=${date}`;
    try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data); // gibt die Daten der API in der Konsole aus
    } catch (error) {
    console.error(error)
    }

}

const datepicker = document.querySelector('#datepicker');
datepicker.addEventListener('change', function(){
    const date = datepicker.value;
    getByDate(date)
    console.log(date);


})


async function getBorough(borough){
    const url = `https://im3.angelina-fruehwirth.ch/backend/api/getBorough.php?borough=${borough}`;
    try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(borough); // gibt die Daten der API in der Konsole aus
    } catch (error) {
    console.error(error)
    }

}

async function fetchBoroughData(borough) {
  const response = await fetch(`/api/borough.php?borough=${borough}`);
  const data = await response.json();
  console.log(data);
}