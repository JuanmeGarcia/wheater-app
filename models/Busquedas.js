const fs = require('fs')
const axios = require('axios')

class Busquedas {
	historial = []
    dbPath = './db/historial.json'

	constructor() {
		//leer db si existe
        this.readDB()
	}

	get paramsMapBox() {
		return {
			access_token: process.env.MAPBOX_KEY,
			limit: 5,
			language: 'es',
		}
	}

	get paramsWheater() {
		return {
			appid: process.env.OPENWHEATHER_KEY,
			units: 'metric',
			lang: 'es',
		}
	}

	//peticion a api de mapbox
	async searchCity(place = '') {
		try {
			const instance = axios.create({
				baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
				params: this.paramsMapBox,
			})
			const { data } = await instance.get()
			return data.features.map(place => ({
				id: place.id,
				placeName: place.place_name,
				longitude: place.center[0],
				latitude: place.center[1],
			}))
		} catch (error) {
			console.error(error)
			return []
		}
	}

	async getWeather(lat, lon) {
		try {
			const instance = axios.create({
				baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    ...this.paramsWheater,
                    lat,
                    lon
                }
			})
            const { data } = await instance.get()
            return {
                temperature: data.main.temp,
                maxTemperature: data.main.temp_max,
                minTemperature: data.main.temp_min,
                description: data.weather[0].description,
            }

		} catch (error) {
			console.log(error)
		}
	}

    agregarHistorial(place = ''){
        if(this.historial.includes(place)){
            return
        }
        this.historial = this.historial.splice(0, 5)
        this.historial.unshift(place)

        this.saveDB()
    }

    saveDB(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    readDB(){
        if(!fs.existsSync(this.dbPath)){
            return null
        }
        const info = fs.readFileSync(this.dbPath, {
            encoding: 'utf-8'
        })
        const data = JSON.parse(info)

        this.historial = data.historial

    }
}

module.exports = Busquedas
