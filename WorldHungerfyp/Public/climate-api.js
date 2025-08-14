// This file connects to weather services to give you growing advice based on your location

// Database of city locations around the world
const cityCoordinates = {
    // United Kingdom
    "london": { latitude: 51.5074, longitude: -0.1278 },
    "manchester": { latitude: 53.4808, longitude: -2.2426 },
    "birmingham": { latitude: 52.4862, longitude: -1.8904 },
    "liverpool": { latitude: 53.4084, longitude: -2.9916 },
    "glasgow": { latitude: 55.8642, longitude: -4.2518 },
    "edinburgh": { latitude: 55.9533, longitude: -3.1883 },
    "cardiff": { latitude: 51.4816, longitude: -3.1791 },
    "bristol": { latitude: 51.4545, longitude: -2.5879 },
    "leeds": { latitude: 53.8008, longitude: -1.5491 },
    "belfast": { latitude: 54.5973, longitude: -5.9301 },
    "newcastle": { latitude: 54.9783, longitude: -1.6178 },
    "sheffield": { latitude: 53.3811, longitude: -1.4701 },
    "nottingham": { latitude: 52.9548, longitude: -1.1581 },
    "brighton": { latitude: 50.8225, longitude: -0.1372 },
    "leicester": { latitude: 52.6369, longitude: -1.1398 },
    "coventry": { latitude: 52.4068, longitude: -1.5197 },
    "york": { latitude: 53.9599, longitude: -1.0873 },
    "aberdeen": { latitude: 57.1497, longitude: -2.0943 },

    // Europe
    "paris": { latitude: 48.8566, longitude: 2.3522 },
    "berlin": { latitude: 52.5200, longitude: 13.4050 },
    "madrid": { latitude: 40.4168, longitude: -3.7038 },
    "rome": { latitude: 41.9028, longitude: 12.4964 },
    "amsterdam": { latitude: 52.3676, longitude: 4.9041 },
    "brussels": { latitude: 50.8503, longitude: 4.3517 },
    "vienna": { latitude: 48.2082, longitude: 16.3738 },
    "prague": { latitude: 50.0755, longitude: 14.4378 },
    "budapest": { latitude: 47.4979, longitude: 19.0402 },
    "warsaw": { latitude: 52.2297, longitude: 21.0122 },
    "stockholm": { latitude: 59.3293, longitude: 18.0686 },
    "copenhagen": { latitude: 55.6761, longitude: 12.5683 },
    "oslo": { latitude: 59.9139, longitude: 10.7522 },
    "helsinki": { latitude: 60.1699, longitude: 24.9384 },
    "dublin": { latitude: 53.3498, longitude: -6.2603 },
    "lisbon": { latitude: 38.7223, longitude: -9.1393 },
    "athens": { latitude: 37.9838, longitude: 23.7275 },
    "zurich": { latitude: 47.3769, longitude: 8.5417 },
    "barcelona": { latitude: 41.3851, longitude: 2.1734 },
    "milan": { latitude: 45.4642, longitude: 9.1900 },
    "munich": { latitude: 48.1351, longitude: 11.5820 },
    "moscow": { latitude: 55.7558, longitude: 37.6173 },
    "st petersburg": { latitude: 59.9311, longitude: 30.3609 },

    // United States
    "new york": { latitude: 40.7128, longitude: -74.0060 },
    "los angeles": { latitude: 34.0522, longitude: -118.2437 },
    "chicago": { latitude: 41.8781, longitude: -87.6298 },
    "houston": { latitude: 29.7604, longitude: -95.3698 },
    "phoenix": { latitude: 33.4484, longitude: -112.0740 },
    "philadelphia": { latitude: 39.9526, longitude: -75.1652 },
    "san antonio": { latitude: 29.4241, longitude: -98.4936 },
    "san diego": { latitude: 32.7157, longitude: -117.1611 },
    "dallas": { latitude: 32.7767, longitude: -96.7970 },
    "san jose": { latitude: 37.3382, longitude: -121.8863 },
    "austin": { latitude: 30.2672, longitude: -97.7431 },
    "fort worth": { latitude: 32.7555, longitude: -97.3308 },
    "jacksonville": { latitude: 30.3322, longitude: -81.6557 },
    "columbus": { latitude: 39.9612, longitude: -82.9988 },
    "boston": { latitude: 42.3601, longitude: -71.0589 },
    "seattle": { latitude: 47.6062, longitude: -122.3321 },
    "denver": { latitude: 39.7392, longitude: -104.9903 },
    "washington": { latitude: 38.9072, longitude: -77.0369 },
    "washington dc": { latitude: 38.9072, longitude: -77.0369 },
    "miami": { latitude: 25.7617, longitude: -80.1918 },
    "atlanta": { latitude: 33.7490, longitude: -84.3880 },
    "san francisco": { latitude: 37.7749, longitude: -122.4194 },
    "portland": { latitude: 45.5051, longitude: -122.6750 },
    "las vegas": { latitude: 36.1699, longitude: -115.1398 },

    // Canada
    "toronto": { latitude: 43.6532, longitude: -79.3832 },
    "montreal": { latitude: 45.5017, longitude: -73.5673 },
    "vancouver": { latitude: 49.2827, longitude: -123.1207 },
    "calgary": { latitude: 51.0447, longitude: -114.0719 },
    "edmonton": { latitude: 53.5461, longitude: -113.4938 },
    "ottawa": { latitude: 45.4215, longitude: -75.6972 },
    "winnipeg": { latitude: 49.8951, longitude: -97.1384 },

    // Asia
    "tokyo": { latitude: 35.6762, longitude: 139.6503 },
    "delhi": { latitude: 28.6139, longitude: 77.2090 },
    "shanghai": { latitude: 31.2304, longitude: 121.4737 },
    "beijing": { latitude: 39.9042, longitude: 116.4074 },
    "mumbai": { latitude: 19.0760, longitude: 72.8777 },
    "dhaka": { latitude: 23.8103, longitude: 90.4125 },
    "bangkok": { latitude: 13.7563, longitude: 100.5018 },
    "singapore": { latitude: 1.3521, longitude: 103.8198 },
    "seoul": { latitude: 37.5665, longitude: 126.9780 },
    "jakarta": { latitude: 6.2088, longitude: 106.8456 },
    "hong kong": { latitude: 22.3193, longitude: 114.1694 },
    "taipei": { latitude: 25.0330, longitude: 121.5654 },
    "kuala lumpur": { latitude: 3.1390, longitude: 101.6869 },
    "manila": { latitude: 14.5995, longitude: 120.9842 },
    "riyadh": { latitude: 24.7136, longitude: 46.6753 },
    "dubai": { latitude: 25.2048, longitude: 55.2708 },
    "istanbul": { latitude: 41.0082, longitude: 28.9784 },

    // Australia/Oceania
    "sydney": { latitude: -33.8688, longitude: 151.2093 },
    "melbourne": { latitude: -37.8136, longitude: 144.9631 },
    "brisbane": { latitude: -27.4698, longitude: 153.0251 },
    "perth": { latitude: -31.9505, longitude: 115.8605 },
    "adelaide": { latitude: -34.9285, longitude: 138.6007 },
    "auckland": { latitude: -36.8509, longitude: 174.7645 },
    "wellington": { latitude: -41.2865, longitude: 174.7762 },

    // Africa
    "cairo": { latitude: 30.0444, longitude: 31.2357 },
    "johannesburg": { latitude: -26.2041, longitude: 28.0473 },
    "lagos": { latitude: 6.5244, longitude: 3.3792 },
    "nairobi": { latitude: -1.2921, longitude: 36.8219 },
    "casablanca": { latitude: 33.5731, longitude: -7.5898 },
    "cape town": { latitude: -33.9249, longitude: 18.4241 },
    "tunis": { latitude: 36.8065, longitude: 10.1815 },

    // South America
    "sao paulo": { latitude: -23.5505, longitude: -46.6333 },
    "rio de janeiro": { latitude: -22.9068, longitude: -43.1729 },
    "buenos aires": { latitude: -34.6037, longitude: -58.3816 },
    "bogota": { latitude: 4.7110, longitude: -74.0721 },
    "santiago": { latitude: -33.4489, longitude: -70.6693 },
    "lima": { latitude: -12.0464, longitude: -77.0428 },
    "caracas": { latitude: 10.4806, longitude: -66.9036 },

    // Mexico/Central America
    "mexico city": { latitude: 19.4326, longitude: -99.1332 },
    "guatemala city": { latitude: 14.6349, longitude: -90.5069 },
    "panama city": { latitude: 8.9936, longitude: -79.5197 }
};

// Gets your location using your browser (if you allow it)
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Location error:", error);
                    reject(error);
                }
            );
        } else {
            reject(new Error("This browser does not support geolocation."));
        }
    });
}

// Gets weather information from the weather service
async function fetchWeatherData(latitude, longitude) {
    try {
        // Build the web address to get weather data
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&current_weather=true&timezone=auto`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`An HTTP error has occurred! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

// Finds a city from what the user typed
function findCity(input) {
    // Clean up what the user typed
    const normalizedInput = input.trim().toLowerCase();

    // Look for exact match
    if (cityCoordinates[normalizedInput]) {
        return {
            name: normalizedInput,
            coordinates: cityCoordinates[normalizedInput]
        };
    }

    // Look for partial matches
    for (const city in cityCoordinates) {
        if (city.includes(normalizedInput) || normalizedInput.includes(city)) {
            return {
                name: city,
                coordinates: cityCoordinates[city]
            };
        }
    }

    // Try to match cities with spaces in their names
    if (normalizedInput.includes(' ')) {
        const parts = normalizedInput.split(' ');
        for (const city in cityCoordinates) {
            // Check if any word matches part of a city name
            if (parts.some(part => city.includes(part) && part.length > 2)) {
                return {
                    name: city,
                    coordinates: cityCoordinates[city]
                };
            }
        }
    }
    return null;
}

// Figures out what crops to recommend based on the weather
function getCropRecommendations(weatherData) {
    const currentTemp = weatherData.current_weather.temperature;
    const maxTemps = weatherData.daily.temperature_2m_max;
    const minTemps = weatherData.daily.temperature_2m_min;
    const precipitation = weatherData.daily.precipitation_sum;

    // Calculate average temperatures and rainfall
    const avgMaxTemp = maxTemps.reduce((sum, temp) => sum + temp, 0) / maxTemps.length;
    const avgMinTemp = minTemps.reduce((sum, temp) => sum + temp, 0) / minTemps.length;
    const avgTemp = (avgMaxTemp + avgMinTemp) / 2;
    const totalPrecipitation = precipitation.reduce((sum, precip) => sum + precip, 0);

    // Determine what type of climate you have
    let climateType = "";
    if (avgTemp > 25) {
        if (totalPrecipitation > 20) {
            climateType = "hot-wet";
        } else {
            climateType = "hot-dry";
        }
    } else if (avgTemp > 15) {
        if (totalPrecipitation > 20) {
            climateType = "warm-wet";
        } else {
            climateType = "warm-dry";
        }
    } else {
        if (totalPrecipitation > 20) {
            climateType = "cool-wet";
        } else {
            climateType = "cool-dry";
        }
    }

    // Different crops for different climates
    const recommendations = {
        "hot-wet": {
            climate: "Hot and Wet",
            description: "It is hot and rainy where you live, almost like in a tropical climate.",
            recommendedCrops: ["Sweet Potatoes", "Okra", "Peppers", "Eggplant", "Amaranth", "Taro", "Cassava"],
            tips: [
                "Provide good drainage for excess water",
                "Use shade cloth during the hottest parts of the day",
                "Choose heat-tolerant varieties",
                "Watch for fungal diseases due to humidity"
            ]
        },
        "hot-dry": {
            climate: "Hot and Dry",
            description: "Your climate is hot with minimal rainfall, similar to desert or Mediterranean summer conditions.",
            recommendedCrops: ["Tomatoes", "Peppers", "Eggplant", "Rosemary", "Thyme", "Sage", "Lavender", "Succulents"],
            tips: [
                "Water deeply but infrequently",
                "Use mulch to retain soil moisture",
                "Provide afternoon shade for sensitive plants",
                "Consider drip irrigation to conserve water"
            ]
        },
        "warm-wet": {
            climate: "Warm and Wet",
            description: "Your climate is moderately warm with regular rainfall, ideal for many crops.",
            recommendedCrops: ["Tomatoes", "Peppers", "Beans", "Squash", "Cucumbers", "Basil", "Mint", "Cilantro"],
            tips: [
                "Ensure good air circulation to prevent disease",
                "Use raised beds for better drainage if needed",
                "Most herbs and vegetables will thrive in these conditions",
                "Monitor for pests which can multiply quickly in warm, humid environments"
            ]
        },
        "warm-dry": {
            climate: "Warm and Dry",
            description: "Your climate is moderately warm with minimal rainfall, similar to Mediterranean conditions.",
            recommendedCrops: ["Tomatoes", "Peppers", "Zucchini", "Eggplant", "Beans", "Rosemary", "Thyme", "Oregano"],
            tips: [
                "Water consistently but allow soil to dry between waterings",
                "Use mulch to conserve moisture",
                "Mediterranean herbs will thrive in these conditions",
                "Consider afternoon shade for more sensitive plants"
            ]
        },
        "cool-wet": {
            climate: "Cool and Wet",
            description: "Your climate is cool with regular rainfall, ideal for leafy greens and root vegetables.",
            recommendedCrops: ["Lettuce", "Spinach", "Kale", "Arugula", "Carrots", "Radishes", "Peas", "Broccoli"],
            tips: [
                "Use raised beds to improve drainage",
                "Consider row covers to protect from excessive rainfall",
                "Focus on cool-season crops",
                "Watch for slugs and snails which thrive in moist conditions"
            ]
        },
        "cool-dry": {
            climate: "Cool and Dry",
            description: "Your climate is cool with minimal rainfall, good for many cool-season crops with proper irrigation.",
            recommendedCrops: ["Lettuce", "Spinach", "Kale", "Carrots", "Beets", "Onions", "Garlic", "Cabbage"],
            tips: [
                "Water consistently as needed",
                "Use mulch to retain moisture and suppress weeds",
                "Cool-season crops will thrive with proper care",
                "Consider season extension techniques like cold frames"
            ]
        }
    };

    return recommendations[climateType];
}

// Main function that runs when user clicks "Get Recommendations" or presses Enter
async function getClimateRecommendations() {
    // Get the input field and UI elements
    const locationInput = document.getElementById('location-input');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const climateResults = document.getElementById('climate-results');

    // Check if we're on a page with the new UI format
    const isNewUIFormat = loadingIndicator && errorMessage && climateResults;

    if (isNewUIFormat) {
        // Use the new UI format (same as the button click)
        const location = locationInput.value.trim();

        // Make sure they typed something
        if (!location) {
            showError('Please enter a location');
            return;
        }

        // Show loading message
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        climateResults.style.display = 'none';

        try {
            // Enhanced city finding with better error handling
            const normalizedInput = location.toLowerCase();
            let locationData;
            let cityName;
            let possibleMatches = [];

            // First check for exact match
            if (cityCoordinates[normalizedInput]) {
                locationData = cityCoordinates[normalizedInput];
                cityName = normalizedInput.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            } else {
                // Find all partial matches
                for (const city in cityCoordinates) {
                    if (city.includes(normalizedInput)) {
                        possibleMatches.push({
                            name: city,
                            coordinates: cityCoordinates[city],
                            matchScore: city.startsWith(normalizedInput) ? 2 : 1
                        });
                    }
                }

                // Sort by match score (prioritize cities that start with the input)
                possibleMatches.sort((a, b) => b.matchScore - a.matchScore);

                if (possibleMatches.length === 0) {
                    throw new Error(`City "${location}" not found. Please try entering a major city name like London, Paris, New York, Tokyo, etc.`);
                } else if (possibleMatches.length === 1) {
                    // Only one match found
                    locationData = possibleMatches[0].coordinates;
                    cityName = possibleMatches[0].name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                } else {
                    // Multiple matches - show options to user
                    const cityList = possibleMatches.slice(0, 5).map(m =>
                        m.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                    ).join(', ');
                    throw new Error(`Multiple cities found matching "${location}". Did you mean: ${cityList}? Please be more specific.`);
                }
            }

            // Get the weather for that location
            const weatherData = await fetchWeatherData(locationData.latitude, locationData.longitude);

            // Get crop recommendations based on weather
            const recommendations = getCropRecommendations(weatherData);

            // Calculate averages for display
            const maxTemps = weatherData.daily.temperature_2m_max;
            const minTemps = weatherData.daily.temperature_2m_min;
            const precipitation = weatherData.daily.precipitation_sum;

            const avgMaxTempVal = maxTemps.reduce((sum, temp) => sum + temp, 0) / maxTemps.length;
            const avgMinTempVal = minTemps.reduce((sum, temp) => sum + temp, 0) / minTemps.length;
            const totalPrecipitationVal = precipitation.reduce((sum, precip) => sum + precip, 0);

            // Hide loading message
            loadingIndicator.style.display = 'none';

            // Get UI elements
            const locationName = document.getElementById('location-name');
            const locationRegion = document.getElementById('location-region');
            const climateType = document.getElementById('climate-type');
            const avgMaxTemp = document.getElementById('avg-max-temp');
            const avgMinTemp = document.getElementById('avg-min-temp');
            const totalPrecipitation = document.getElementById('total-precipitation');
            const climateDescription = document.getElementById('climate-description');
            const vegetableList = document.getElementById('vegetable-list');
            const herbList = document.getElementById('herb-list');
            const fruitList = document.getElementById('fruit-list');

            // Display the data in the new UI format
            locationName.textContent = cityName;
            locationRegion.textContent = ''; // Could add country info if available

            climateType.textContent = recommendations.climate;
            avgMaxTemp.textContent = avgMaxTempVal.toFixed(1);
            avgMinTemp.textContent = avgMinTempVal.toFixed(1);
            totalPrecipitation.textContent = totalPrecipitationVal.toFixed(1);

            climateDescription.textContent = recommendations.description;

            // Clear old lists
            vegetableList.innerHTML = '';
            herbList.innerHTML = '';
            fruitList.innerHTML = '';

            // Define crop categories with 5 climate-appropriate selections each
            const cropDatabase = {
                vegetables: {
                    'hot-wet': ['Sweet Potatoes', 'Okra', 'Eggplant', 'Amaranth', 'Taro'],
                    'hot-dry': ['Tomatoes', 'Peppers', 'Eggplant', 'Armenian Cucumber', 'Swiss Chard'],
                    'warm-wet': ['Tomatoes', 'Squash', 'Cucumbers', 'Beans', 'Corn'],
                    'warm-dry': ['Tomatoes', 'Peppers', 'Zucchini', 'Eggplant', 'Beans'],
                    'cool-wet': ['Lettuce', 'Spinach', 'Kale', 'Arugula', 'Peas'],
                    'cool-dry': ['Lettuce', 'Carrots', 'Beets', 'Onions', 'Cabbage']
                },
                herbs: {
                    'hot-wet': ['Basil', 'Mint', 'Lemongrass', 'Ginger', 'Turmeric'],
                    'hot-dry': ['Rosemary', 'Thyme', 'Sage', 'Lavender', 'Oregano'],
                    'warm-wet': ['Basil', 'Mint', 'Cilantro', 'Parsley', 'Chives'],
                    'warm-dry': ['Rosemary', 'Thyme', 'Oregano', 'Marjoram', 'Savory'],
                    'cool-wet': ['Parsley', 'Chives', 'Dill', 'Fennel', 'Tarragon'],
                    'cool-dry': ['Parsley', 'Sage', 'Thyme', 'Chives', 'Rosemary']
                },
                fruits: {
                    'hot-wet': ['Passion Fruit', 'Papaya', 'Dragon Fruit', 'Mangoes', 'Bananas'],
                    'hot-dry': ['Figs', 'Pomegranates', 'Dates', 'Grapes', 'Citrus'],
                    'warm-wet': ['Strawberries', 'Blackberries', 'Raspberries', 'Blueberries', 'Kiwi'],
                    'warm-dry': ['Grapes', 'Strawberries', 'Melons', 'Figs', 'Apricots'],
                    'cool-wet': ['Blueberries', 'Raspberries', 'Currants', 'Gooseberries', 'Elderberries'],
                    'cool-dry': ['Apples', 'Pears', 'Cherries', 'Plums', 'Apricots']
                }
            };

            // Determine climate type
            const avgTemp = (avgMaxTempVal + avgMinTempVal) / 2;
            let climateTypeKey = "";

            if (avgTemp > 25) {
                climateTypeKey = totalPrecipitationVal > 20 ? "hot-wet" : "hot-dry";
            } else if (avgTemp > 15) {
                climateTypeKey = totalPrecipitationVal > 20 ? "warm-wet" : "warm-dry";
            } else {
                climateTypeKey = totalPrecipitationVal > 20 ? "cool-wet" : "cool-dry";
            }

            // Get 5 recommendations for each category
            const vegRecommendations = cropDatabase.vegetables[climateTypeKey] || ['Lettuce', 'Tomatoes', 'Carrots', 'Spinach', 'Radishes'];
            const herbRecommendations = cropDatabase.herbs[climateTypeKey] || ['Basil', 'Parsley', 'Mint', 'Cilantro', 'Chives'];
            const fruitRecommendations = cropDatabase.fruits[climateTypeKey] || ['Strawberries', 'Blueberries', 'Apples', 'Raspberries', 'Grapes'];

            // Add vegetables
            vegRecommendations.forEach(veg => {
                const li = document.createElement('li');
                li.textContent = veg;
                vegetableList.appendChild(li);
            });

            // Add herbs
            herbRecommendations.forEach(herb => {
                const li = document.createElement('li');
                li.textContent = herb;
                herbList.appendChild(li);
            });

            // Add fruits
            fruitRecommendations.forEach(fruit => {
                const li = document.createElement('li');
                li.textContent = fruit;
                fruitList.appendChild(li);
            });

            // Show all the results
            climateResults.style.display = 'block';

        } catch (error) {
            loadingIndicator.style.display = 'none';
            showError(error.message || 'Error connecting to the climate service');
        }

    } else {
        // Fall back to old UI format for compatibility
        try {
            // Show loading message
            const resultsContainer = document.getElementById('climate-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = '<p>Loading climate data...</p>';
            }

            // Figure out the location
            let location;
            let cityName;
            const locationInputValue = locationInput ? locationInput.value : '';

            if (locationInputValue) {
                // User typed a city name
                const cityMatch = findCity(locationInputValue);

                if (cityMatch) {
                    location = cityMatch.coordinates;
                    cityName = cityMatch.name.charAt(0).toUpperCase() + cityMatch.name.slice(1);
                } else {
                    throw new Error("Not able to find you. Please manually enter the city's name.");
                }
            } else {
                // Try to use browser location
                try {
                    location = await getUserLocation();
                    cityName = "Your Current Location";
                } catch (error) {
                    throw new Error("Was unable to locate you. Please manually input the name of the city.");
                }
            }

            // Get the weather for that location
            const weatherData = await fetchWeatherData(location.latitude, location.longitude);

            // Get crop recommendations based on weather
            const recommendations = getCropRecommendations(weatherData);

            // Show the results on the page (old format)
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <h3>Growing Recommendations for ${cityName}</h3>
                    <div class="climate-card">
                        <h4>${recommendations.climate} Climate</h4>
                        <p>${recommendations.description}</p>
                        
                        <h4>Current Weather Conditions:</h4>
                        <p>Temperature: ${weatherData.current_weather.temperature}°C</p>
                        <p>Wind Speed: ${weatherData.current_weather.windspeed} km/h</p>
                        
                        <h4>Recommended Crops:</h4>
                        <ul class="crop-list">
                            ${recommendations.recommendedCrops.map(crop => `<li>${crop}</li>`).join('')}
                        </ul>
                        
                        <h4>Growing Tips:</h4>
                        <ul class="tips-list">
                            ${recommendations.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        } catch (error) {
            // Show error message if something went wrong
            const resultsContainer = document.getElementById('climate-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="error-message">
                        <p>Error: ${error.message}</p>
                        <p>Try entering a major city name like London, New York, Paris, Tokyo, etc.</p>
                    </div>
                `;
            }
        }
    }
}

// Helper function to show error messages in the new UI format
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    const climateResults = document.getElementById('climate-results');

    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    if (climateResults) {
        climateResults.style.display = 'none';
    }
}

// Set up the page when it loads
document.addEventListener('DOMContentLoaded', function () {
    const recommendButton = document.getElementById('get-recommendations');
    if (recommendButton) {
        recommendButton.addEventListener('click', getClimateRecommendations);
    }

    // Let user press Enter instead of clicking button
    const locationInput = document.getElementById('location-input');
    if (locationInput) {
        locationInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                getClimateRecommendations();
            }
        });
    }
});