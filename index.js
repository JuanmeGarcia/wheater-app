require('dotenv').config()
require('colors')
const { readInput, inquirerMenu, pause, listPlaces } = require('./helpers/inquirer')
const Busquedas = require('./models/Busquedas')


const main = async () => {
    let option = 0
    const busquedas = new Busquedas()
    do{
        const menu = await inquirerMenu()
        option = menu
        
        switch(option){
            case 1:
                //mostrar mensaje
                const parameter = await readInput('Ingrese una ciudad: \n')
                //buscar lugar
                const places = await busquedas.searchCity(parameter)
                //seleccionar el lugar
                const id = await listPlaces(places)
                if(id === '0'){
                    continue
                }
                
                const placeSelected = places.find(place => place.id === id)
                const { placeName, latitude, longitude } = placeSelected

                busquedas.agregarHistorial(placeName)

                const weather = await busquedas.getWeather(latitude, longitude)
                const { temperature, maxTemperature, minTemperature, description } = weather

                //buscar las ciudades
                //seleccionar el lugar
                //datos del clima
                //mostrar en pantalla los resultados
                console.log('\nInformacion de la ciudad \n'.green)
                console.log(`Ciudad: ${placeName}`.blue)
                console.log(`Latitud: ${latitude}`.blue)
                console.log(`Longitud: ${longitude}`.blue)
                console.log(`Temperatura: ${temperature}`.blue)
                console.log(`Maxima: ${maxTemperature}`.blue)
                console.log(`Minima: ${minTemperature}`.blue)
                console.log(`Descripcion: ${description}`.blue)

                
                break;

            case 2:
                busquedas.historial.forEach((place, index) => (
                    console.log(`${index + 1}. ${place}`)
                    ))
                break; 
            }
            
            option !== 0 && await pause()
        }while(option !== 0)
        
    }

main()