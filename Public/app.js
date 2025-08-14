const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();
const port = 3000;


// Climate API route
app.get('/api/climate', async (req, res) => {
    try {
        const { location } = req.query;

        if (!location) {
            return res.status(400).json({ message: 'Location is required' });
        }

        // Step 1: Geocode the location (convert location name to coordinates)
        // Using Open-Meteo Geocoding API
        const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
        const geocodeData = await geocodeResponse.json();

        if (!geocodeData.results || geocodeData.results.length === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }

        const { latitude, longitude } = geocodeData.results[0];

        // Step 2: Fetch climate data from Open-Meteo API
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=16`
        );
        const weatherData = await weatherResponse.json();

        // Step 3: Process data and generate recommendations
        const recommendations = generateCropRecommendations(weatherData);

        // Return combined data
        res.json({
            location: geocodeData.results[0],
            climate: weatherData,
            recommendations
        });

    } catch (error) {
        console.error('Climate API error:', error);
        res.status(500).json({ message: 'Error fetching climate data' });
    }
});

// Helper function to generate crop recommendations based on weather data
function generateCropRecommendations(weatherData) {
    // Extract useful metrics
    const avgMaxTemp = average(weatherData.daily.temperature_2m_max);
    const avgMinTemp = average(weatherData.daily.temperature_2m_min);
    const totalPrecipitation = sum(weatherData.daily.precipitation_sum);

    // Climate classification
    let climateType = '';

    if (avgMaxTemp > 30) {
        if (totalPrecipitation < 20) {
            climateType = 'hot-dry';
        } else {
            climateType = 'hot-humid';
        }
    } else if (avgMaxTemp > 20) {
        if (totalPrecipitation < 20) {
            climateType = 'warm-dry';
        } else {
            climateType = 'warm-humid';
        }
    } else {
        if (totalPrecipitation < 20) {
            climateType = 'cool-dry';
        } else {
            climateType = 'cool-humid';
        }
    }

    // Crop recommendations based on climate type
    const recommendations = {
        climateType,
        avgMaxTemp,
        avgMinTemp,
        totalPrecipitation,
        suitable_crops: getCropsForClimate(climateType)
    };

    return recommendations;
}

// Get suitable crops based on climate type
function getCropsForClimate(climateType) {
    const cropRecommendations = {
        'hot-dry': {
            vegetables: ['tomatoes', 'peppers', 'eggplant', 'okra', 'sweet potatoes'],
            herbs: ['rosemary', 'thyme', 'sage', 'oregano', 'basil'],
            fruits: ['watermelon', 'cantaloupe', 'figs', 'pomegranates'],
            description: 'Focus on drought-resistant varieties and provide shade during the hottest part of the day.'
        },
        'hot-humid': {
            vegetables: ['okra', 'sweet potatoes', 'yams', 'yard-long beans', 'amaranth'],
            herbs: ['basil', 'lemongrass', 'mint', 'cilantro'],
            fruits: ['bananas', 'papayas', 'pineapples', 'mangoes'],
            description: 'Choose heat-tolerant varieties resistant to fungal diseases. Provide good air circulation.'
        },
        'warm-dry': {
            vegetables: ['tomatoes', 'peppers', 'cucumbers', 'zucchini', 'beans'],
            herbs: ['basil', 'oregano', 'rosemary', 'thyme', 'sage'],
            fruits: ['grapes', 'melons', 'strawberries'],
            description: 'Provide consistent watering and mulch to retain soil moisture.'
        },
        'warm-humid': {
            vegetables: ['tomatoes', 'peppers', 'eggplant', 'cucumbers', 'beans', 'corn'],
            herbs: ['basil', 'mint', 'cilantro', 'parsley'],
            fruits: ['strawberries', 'blueberries', 'raspberries'],
            description: 'Focus on varieties resistant to fungal diseases and provide good spacing for air circulation.'
        },
        'cool-dry': {
            vegetables: ['lettuce', 'spinach', 'kale', 'carrots', 'radishes', 'peas'],
            herbs: ['parsley', 'cilantro', 'dill', 'chives'],
            fruits: ['apples', 'pears', 'strawberries'],
            description: 'Provide consistent moisture and consider row covers for cold protection.'
        },
        'cool-humid': {
            vegetables: ['lettuce', 'spinach', 'kale', 'broccoli', 'cabbage', 'peas', 'radishes'],
            herbs: ['parsley', 'cilantro', 'chives', 'mint'],
            fruits: ['strawberries', 'blueberries', 'raspberries'],
            description: 'Choose disease-resistant varieties and maintain good air circulation.'
        }
    };

    return cropRecommendations[climateType] || {
        vegetables: ['tomatoes', 'lettuce', 'radishes'],
        herbs: ['basil', 'parsley'],
        fruits: ['strawberries'],
        description: 'These versatile crops adapt to many growing conditions.'
    };
}

// Helper functions
function average(array) {
    return array.reduce((a, b) => a + b, 0) / array.length;
}

function sum(array) {
    return array.reduce((a, b) => a + b, 0);
}


// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://micailbakz:DxhOzviLPE46fGSH@urban-farming.ridygdj.mongodb.net/urban-farming?retryWrites=true&w=majority&appName=urban-farming', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'urban-farming-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Routes for authentication
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Create session
        req.session.userId = user._id;
        req.session.username = user.username;

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.redirect('/');
    });
});

// Check if user is logged in
app.get('/check-auth', (req, res) => {
    if (req.session.userId) {
        return res.status(200).json({
            isAuthenticated: true,
            username: req.session.username
        });
    }
    res.status(200).json({ isAuthenticated: false });
});

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

// Example protected route
app.get('/profile', isAuthenticated, (req, res) => {
    res.json({ username: req.session.username });
});

// Resource schema and model
const resourceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    contactInfo: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Resource = mongoose.model('Resource', resourceSchema);

// Get all resources
app.get('/api/resources', async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ message: 'Error fetching resources' });
    }
});

// Create a new resource (protected route)
app.post('/api/resources', isAuthenticated, async (req, res) => {
    try {
        const { title, category, description, quantity, location, contactInfo } = req.body;

        // Create new resource
        const newResource = new Resource({
            userId: req.session.userId,
            ownerName: req.session.username,
            title,
            category,
            description,
            quantity: Number(quantity),
            location,
            contactInfo,
        });

        await newResource.save();
        res.status(201).json(newResource);
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ message: 'Error creating resource' });
    }
});

// User profile schema and model - UPDATED WITH WEATHER PREFERENCES
const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    displayName: { type: String },
    bio: { type: String },
    // Weather preferences for the progress dashboard
    weatherPreferences: {
        location: String,
        enableFrostAlerts: {
            type: Boolean,
            default: true
        },
        enableExtremeHeatAlerts: {
            type: Boolean,
            default: true
        },
        enableHeavyRainAlerts: {
            type: Boolean,
            default: true
        }
    },
    updatedAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);

// Get user profile
app.get('/api/profile', isAuthenticated, async (req, res) => {
    try {
        // Find profile or create one if it doesn't exist
        let profile = await Profile.findOne({ userId: req.session.userId });

        if (!profile) {
            // Create a new profile
            profile = new Profile({ userId: req.session.userId });
            await profile.save();
        }

        // Get user data to include in response
        const user = await User.findById(req.session.userId);

        // Return combined data
        res.json({
            displayName: profile.displayName,
            bio: profile.bio,
            username: user.username,
            email: user.email,
            createdAt: user._id.getTimestamp() // Use the MongoDB ObjectId creation time
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// Update user profile
app.put('/api/profile', isAuthenticated, async (req, res) => {
    try {
        const { displayName, bio } = req.body;

        // Find and update profile, or create one if it doesn't exist
        let profile = await Profile.findOne({ userId: req.session.userId });

        if (profile) {
            // Update existing profile
            profile.displayName = displayName;
            profile.bio = bio;
            profile.updatedAt = Date.now();
        } else {
            // Create new profile
            profile = new Profile({
                userId: req.session.userId,
                displayName,
                bio
            });
        }

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Get user's resources (for My Resources tab)
app.get('/api/my-resources', isAuthenticated, async (req, res) => {
    try {
        const resources = await Resource.find({ userId: req.session.userId }).sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        console.error('Error fetching user resources:', error);
        res.status(500).json({ message: 'Error fetching user resources' });
    }
});

// Delete a resource
app.delete('/api/resources/:id', isAuthenticated, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        // Check if resource exists
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check if user owns this resource
        if (resource.userId.toString() !== req.session.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this resource' });
        }

        // Delete the resource
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({ message: 'Error deleting resource' });
    }
});

// ===== CROP TRACKING FUNCTIONALITY =====

// Crop schema and model
const cropSchema = new mongoose.Schema({
    // Which user owns this crop
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // User's name for display
    username: {
        type: String,
        required: true
    },
    // What type of crop (tomatoes, lettuce, etc.)
    cropName: {
        type: String,
        required: true
    },
    // Specific variety (e.g., cherry tomatoes)
    variety: {
        type: String
    },
    // When it was planted
    plantedDate: {
        type: Date,
        required: true
    },
    // When user expects to harvest
    expectedHarvestDate: {
        type: Date
    },
    // Where it's growing (balcony, window box, etc.)
    location: {
        type: String
    },
    // Current status
    status: {
        type: String,
        enum: ['growing', 'harvested', 'failed'],
        default: 'growing'
    },
    // When it was actually harvested
    actualHarvestDate: {
        type: Date
    },
    // How much was harvested
    harvestYield: {
        type: String
    },
    // Any notes from the user
    notes: {
        type: String
    },
    // When this record was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Crop = mongoose.model('Crop', cropSchema);

// Get all crops for logged-in user
app.get('/api/crops', async (req, res) => {
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Get all crops for this user
        const crops = await Crop.find({ userId: req.session.userId });
        res.json(crops);
    } catch (error) {
        console.error('Error fetching crops:', error);
        res.status(500).json({ message: 'Error fetching crops' });
    }
});

// Add a new crop
app.post('/api/crops', async (req, res) => {
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Create new crop with user ID
        const cropData = {
            ...req.body,
            userId: req.session.userId,
            username: req.session.username
        };

        const crop = new Crop(cropData);
        await crop.save();
        res.json(crop);
    } catch (error) {
        console.error('Error creating crop:', error);
        res.status(500).json({ message: 'Error creating crop' });
    }
});

// Update a crop
app.put('/api/crops/:id', async (req, res) => {
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Find and update crop (only if it belongs to this user)
        const crop = await Crop.findOneAndUpdate(
            { _id: req.params.id, userId: req.session.userId },
            req.body,
            { new: true }
        );

        if (!crop) {
            return res.status(404).json({ message: 'Crop not found' });
        }

        res.json(crop);
    } catch (error) {
        console.error('Error updating crop:', error);
        res.status(500).json({ message: 'Error updating crop' });
    }
});

// Delete a crop
app.delete('/api/crops/:id', async (req, res) => {
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Delete crop (only if it belongs to this user)
        const crop = await Crop.findOneAndDelete({
            _id: req.params.id,
            userId: req.session.userId
        });

        if (!crop) {
            return res.status(404).json({ message: 'Crop not found' });
        }

        res.json({ message: 'Crop deleted successfully' });
    } catch (error) {
        console.error('Error deleting crop:', error);
        res.status(500).json({ message: 'Error deleting crop' });
    }
});

// Get weather preferences
app.get('/api/weather-preferences', async (req, res) => {
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Get user's profile for weather preferences
        const profile = await Profile.findOne({ userId: req.session.userId });

        if (profile && profile.weatherPreferences) {
            res.json(profile.weatherPreferences);
        } else {
            // Return empty preferences if none exist
            res.json({});
        }
    } catch (error) {
        console.error('Error fetching weather preferences:', error);
        res.status(500).json({ message: 'Error fetching preferences' });
    }
});

// Save weather preferences
app.put('/api/weather-preferences', async (req, res) => {
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Update profile with weather preferences
        let profile = await Profile.findOne({ userId: req.session.userId });

        if (!profile) {
            // Create new profile if it doesn't exist
            profile = new Profile({
                userId: req.session.userId,
                weatherPreferences: req.body
            });
        } else {
            // Update existing profile
            profile.weatherPreferences = req.body;
            profile.updatedAt = Date.now();
        }

        await profile.save();
        res.json({ message: 'Preferences saved successfully' });
    } catch (error) {
        console.error('Error saving weather preferences:', error);
        res.status(500).json({ message: 'Error saving preferences' });
    }
});

// Delete user account - UPDATED TO INCLUDE CROPS
app.delete('/api/delete-account', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;

        // Delete all user's resources first
        await Resource.deleteMany({ userId: userId });

        // Delete all user's crops
        await Crop.deleteMany({ userId: userId });

        // Delete user's profile if it exists
        await Profile.deleteOne({ userId: userId });

        // Delete the user account
        await User.findByIdAndDelete(userId);

        // Destroy the session
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Error deleting account' });
            }
            res.json({ message: 'Account deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Error deleting account' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});