function dataAtual() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0'); // Garante 2 dígitos (ex: 05)
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa em 0 [3]
    const ano = data.getFullYear();

    const dataatual = `${dia}/${mes}/${ano}`;

    const Data = document.getElementById("data").textContent = dataatual;
}

function getDirecaoVento(graus) {
    const direcoes = [
        "N", "NE", "E", "SE",
        "S", "SO", "O", "NO"
    ];

    const index = Math.round(graus / 45) % 8;
    return direcoes[index];
}

async function getWeather() {
    try{
        const cidade = document.getElementById("inputcidade").value.trim();
        //api q converte nome em latitude e longitude -> cordenadas basicamente
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}`;

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if(!geoData.results || geoData.results.length === 0) {
            alert("Cidade nao encontrada");
            return;
        }

        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;

        const nomeCorreto = geoData.results[0].name;

        const response = await fetch(`https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=iIgODBuUzyw3LMEZ&lat=${lat}&lon=${lon}&asl=867&format=json`);
        if(!response.ok) {
            throw new Error("Erro na API");
        }
        const data = await response.json();
        console.log(data);

        const temperatura = data.data_day.temperature_max[0];
        const sencacaotermica = data.data_day.felttemperature_mean[0];
        const direcaovento = data.data_day.winddirection[0];
        const direcaoTexto = getDirecaoVento(direcaovento);
        const velocidadevento = data.data_day.windspeed_max[0];
        const precipitacao = data.data_day.precipitation[0];
        const probabilidade = data.data_day.precipitation_probability[0];

        document.getElementById("cidade").textContent = nomeCorreto;
        document.getElementById("temperatura").textContent = `${temperatura}°C`;
        document.getElementById("sensacaotermica").textContent = `${sencacaotermica}°C`;
        document.getElementById("direcaovento").textContent = `${direcaoTexto} (${direcaovento}°)`;
        document.getElementById("velocidadevento").textContent = `${velocidadevento}km/h`;
        document.getElementById("precipitacao").textContent = `${precipitacao}mm`;
        document.getElementById("probabilidade").textContent = `${probabilidade}%`;
    }
    catch(error) {
        console.error(error);
        alert("Erro ao buscar dados");
    }
}

dataAtual();