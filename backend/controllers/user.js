import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ------------------ REGISTER ------------------
export const register = async (req, res) => {
  try {
    const { fullname, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      phone,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Create JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "7d"
    });

    // IMPORTANT → Send cookie after register also
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // Required for render.com HTTPS
      sameSite: "none",    // Required for cross-domain cookies
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};


// ------------------ LOGIN ------------------
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (!user || user.role !== role) {
      return res.status(401).json({ message: 'Invalid email, password, or role', success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email, password, or role', success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d"
    });

    // FIXED COOKIE SETTINGS
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};


// ------------------ LOGOUT ------------------
export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0)
    }).status(200).json({
      message: "Logged out successfully",
      success: true
    });

  } catch (error) {
    console.log(error);
  }
};








export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phone, bio, skills, summary } = req.body;
    const file = req.file;
    const userId = req.id; // assuming middleware sets this from JWT

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Convert skills string → array
    let skillsArray = skills
      ? skills.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
      : [];

    // Update base fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Update nested profile fields
    if (bio) user.profile.bio = bio;
    if (skillsArray.length > 0) user.profile.skills = skillsArray;
    if (summary) user.profile.summary = summary; // ✅ ADD THIS LINE

    // Optionally handle file uploads if needed
    if (file) {
      user.profile.resume = file.path;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};
