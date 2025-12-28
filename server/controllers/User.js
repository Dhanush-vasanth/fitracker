import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user: createdUser });
  } catch (error) {
    return next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    // Check if password is correct
    const isPasswordCorrect =  bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const currentDateFormatted = new Date();
    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );
    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    //calculte total calories burnt
    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: null,
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    //Calculate total no of workouts
    const totalWorkouts = await Workout.countDocuments({
      user: userId,
      date: { $gte: startToday, $lt: endToday },
    });

    //Calculate average calories burnt per workout
    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    // Fetch category of workouts
    const categoryCalories = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    //Format category data for pie chart

    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    const weeks = [];
    const caloriesBurnt = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
      );
      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );

      const weekData = await Workout.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by date in ascending order
        },
      ]);

      caloriesBurnt.push(
        weekData[0]?.totalCaloriesBurnt ? weekData[0]?.totalCaloriesBurnt : 0
      );
    }

    return res.status(200).json({
      totalCaloriesBurnt:
        totalCaloriesBurnt.length > 0
          ? totalCaloriesBurnt[0].totalCaloriesBurnt
          : 0,
      totalWorkouts: totalWorkouts,
      avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,
      totalWeeksCaloriesBurnt: {
        weeks: weeks,
        caloriesBurned: caloriesBurnt,
      },
      pieChartData: pieChartData,
    });
  } catch (err) {
    next(err);
  }
};

export const getWorkoutsByDate = async ( req, res, next) => {
    try{
        const userId = req.user?.id;
        const user = await User.findById(userId);
        let date = req.query.date ? new Date(req.query.date) : new Date();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    const todaysWorkouts = await Workout.find({
      user: userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });
    const totalCaloriesBurnt = todaysWorkouts.reduce(
      (total, workout) => total + workout.caloriesBurned,
      0
    );
    return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });

  } catch (err) {
    return next(err);
  }
};

export const addWorkout = async (req, res , next) => {
  try {
    const userId = req.user?.id;
    const { workoutString, date } = req.body;

    if (!workoutString){
      return next(createError(400, "workoutString is required"));
    }

    // Parse the date or use today
    let workoutDate;
    if (date) {
      // Support multiple date formats: DD-MM-YYYY, YYYY-MM-DD
      const parts = date.split('-');
      if (parts[0].length === 4) {
        // YYYY-MM-DD format
        workoutDate = new Date(date);
      } else {
        // DD-MM-YYYY format
        workoutDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    } else {
      workoutDate = new Date();
    }

    // split workoutString into Lines
    const eachworkout = workoutString.split("\n").map((line) => line.trim()).filter(line => line.length > 0);

    //check if any workouts starts with "#" to indicate categories
    const categories = eachworkout.filter((line) => line.startsWith("#"));
    if (categories.length === 0) {
      return next(createError(400, "No categories found in workout string"));
    }

    const parsedWorkouts = [];
    let currentCategory = "Uncategorized";
    let workoutLines = [];

    // Process each line
    for (let i = 0; i < eachworkout.length; i++) {
      const line = eachworkout[i];
      
      if (line.startsWith("#")) {
        // If we have collected workout lines, process them
        if (workoutLines.length > 0) {
          const workoutDetails = parseWorkoutLines(workoutLines, currentCategory);
          if (workoutDetails) {
            parsedWorkouts.push(workoutDetails);
          }
          workoutLines = [];
        }
        
        // Start new category
        currentCategory = line.substring(1).trim();
      } else {
        // Collect workout lines
        workoutLines.push(line);
      }
    }
    
    // Process the last workout if exists
    if (workoutLines.length > 0) {
      const workoutDetails = parseWorkoutLines(workoutLines, currentCategory);
      if (workoutDetails) {
        parsedWorkouts.push(workoutDetails);
      }
    }

    // Calculate calories burnt for each workout
    for (const workout of parsedWorkouts) {
      workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
      await Workout.create({ ...workout, user: userId, date: workoutDate });
    }

    return res.status(201).json({
      message: "Workouts added successfully",
      workouts: parsedWorkouts,
    });
  } catch (err) {
    next(err);
  }
};

// Function to parse workout lines (new format)
const parseWorkoutLines = (lines, category) => {
  if (lines.length < 4) return null;
  
  try {
    const workoutName = lines[0].trim();
    const setsRepsLine = lines[1].trim();
    const weight = parseFloat(lines[2].replace(/[^\d.]/g, '')) || 0;
    const duration = parseFloat(lines[3].replace(/[^\d.]/g, '')) || 0;
    
    // Parse sets and reps from format like "3 sets x 15 reps"
    const setsMatch = setsRepsLine.match(/(\d+)\s*sets/i);
    const repsMatch = setsRepsLine.match(/(\d+)\s*reps/i);
    
    const sets = setsMatch ? parseInt(setsMatch[1]) : 1;
    const reps = repsMatch ? parseInt(repsMatch[1]) : 1;
    
    return {
      category,
      workoutName,
      sets,
      reps,
      weight,
      duration
    };
  } catch (error) {
    return null;
  }
};

// Function to parse workout details from a line (old format)
const parseWorkoutLine = (parts) => {
  const details = {};
  console.log(parts);
  if (parts.length >= 5) {
    details.workoutName = parts[1].substring(1).trim();
    details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
    details.reps = parseInt(
      parts[2].split("sets")[1].split("reps")[0].substring(1).trim()
    );
    details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
    details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());
    console.log(details);
    return details;
  }
  return null;
};

// Function to calculate calories burnt for a workout
const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = parseInt(workoutDetails.duration);
  const weightInKg = parseInt(workoutDetails.weight);
  const caloriesBurntPerMinute = 5; // Sample value, actual calculation may vary
  return durationInMinutes * caloriesBurntPerMinute * weightInKg;
};

// Update a workout
export const updateWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { workoutName, category, sets, reps, weight, duration } = req.body;

    const workout = await Workout.findById(id);
    if (!workout) {
      return next(createError(404, "Workout not found"));
    }

    // Check if the workout belongs to the user
    if (workout.user.toString() !== userId) {
      return next(createError(403, "You can only update your own workouts"));
    }

    // Calculate new calories burned
    const caloriesBurned = calculateCaloriesBurnt({ duration, weight });

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      {
        workoutName: workoutName || workout.workoutName,
        category: category || workout.category,
        sets: sets || workout.sets,
        reps: reps || workout.reps,
        weight: weight !== undefined ? weight : workout.weight,
        duration: duration || workout.duration,
        caloriesBurned
      },
      { new: true }
    );

    return res.status(200).json({ 
      message: "Workout updated successfully",
      workout: updatedWorkout 
    });
  } catch (err) {
    next(err);
  }
};

// Delete a workout
export const deleteWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const workout = await Workout.findById(id);
    if (!workout) {
      return next(createError(404, "Workout not found"));
    }

    // Check if the workout belongs to the user
    if (workout.user.toString() !== userId) {
      return next(createError(403, "You can only delete your own workouts"));
    }

    await Workout.findByIdAndDelete(id);

    return res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Chat with AI (Gemini)
export const chatWithAI = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return next(createError(400, "Message is required"));
    }

    if (!process.env.GEMINI_API_KEY) {
      return next(createError(500, "Gemini API key not configured"));
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // System prompt for fitness context
    const systemPrompt = `You are FitBot, a friendly and knowledgeable AI fitness coach. 
Your expertise includes:
- Workout programming and exercise techniques
- Nutrition and diet advice
- Recovery and injury prevention
- Muscle building and weight loss strategies
- Motivation and goal setting

Guidelines:
- Keep responses concise but informative (under 300 words)
- Use emojis sparingly to be friendly 💪
- Format with bullet points and sections when helpful
- Always prioritize safety - recommend consulting professionals for injuries or medical concerns
- Be encouraging and supportive
- If asked about non-fitness topics, politely redirect to fitness-related advice

User message: `;

    // Build chat history for context
    const chatHistory = history?.slice(-6).map(msg => ({
      role: msg.isUser ? "user" : "model",
      parts: [{ text: msg.content }]
    })) || [];

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(systemPrompt + message);
    const response = result.response.text();

    return res.status(200).json({ 
      message: response,
      success: true 
    });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return next(createError(500, "Failed to get AI response. Please try again."));
  }
};