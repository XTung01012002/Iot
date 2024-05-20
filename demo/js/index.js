function updateTemperatureColor(temp) {
    const informationTempBox = document.getElementById('temperatureValue');
    const informationTempColor = document.getElementById('temperatureColor');

    if (temp > 80) {
      informationTempColor.style.background = 'red';
    } else if (temp > 60) {
      informationTempColor.style.background = 'rgb(230, 49, 49)';
    } else if (temp > 40) {
      informationTempColor.style.background = 'rgb(237, 90, 90)';
    } else if (temp > 20) {
      informationTempColor.style.background = 'lightcoral';
    } else {
      informationTempColor.style.background = 'rgb(247, 137, 137)';
    }

    // Update the content of the temperature box
    informationTempBox.innerText = temp + "°C";

    document.getElementById('temperatureValue').innerText = temp + "°C";
}

// Example usage:
updateTemperatureColor(15); // Update temperature color

function updateHumidityColor(humid) {
    const informationHumidBox = document.getElementById('humidityValue');
    const informationHumidColor = document.getElementById('humidityColor');
  
    if (humid > 80) {
      informationHumidColor.style.background = 'rgb(0, 112, 149)';
    } else if (humid > 60) {
      informationHumidColor.style.background = 'rgb(0, 141, 188)';
    } else if (humid > 40) {
      informationHumidColor.style.background = 'rgb(0, 170, 226)';
    } else if (humid > 20) {
      informationHumidColor.style.background = 'rgb(96, 194, 227)';
    } else {
      informationHumidColor.style.background = 'lightblue';
    }
  
    // Update the content of the humidity box
    informationHumidBox.innerText = humid + "%";
  }
  updateHumidityColor(10);

function updateLightColor(light) {
    const informationLightBox = document.getElementById('lightValue');
    const informationLightColor = document.getElementById('lightColor');
  
    if (light > 80) {
      informationLightColor.style.background = 'rgb(228, 228, 0)';
    } else if (light > 60) {
      informationLightColor.style.background = 'rgb(220, 220, 73)';
    } else if (light > 40) {
      informationLightColor.style.background = 'rgb(195, 195, 132)';
    } else if (light > 20) {
      informationLightColor.style.background = 'rgb(112, 112, 102)';
    } else {
      informationLightColor.style.background = 'rgb(57, 57, 57)';
    }
  
    // Update the content of the light box
    informationLightBox.innerText = light + " LUX";
}
updateLightColor(80);
