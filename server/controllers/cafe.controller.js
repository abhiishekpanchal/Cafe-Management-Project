import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Cafe from "../models/cafe.model.js";
import dotenv from 'dotenv';
import Menu from '../models/menu.model.js';
dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY;

export const cafeRegister = async (req, res, next) => {
    const { name, address, tables, email, phone, password } = req.body;

    try {
        const hashPassword = bcryptjs.hashSync(password, 10);
        const newCafe = new Cafe({ name, address, tables, email, phone, password: hashPassword });
        await newCafe.save();

        const token = jwt.sign({ cafeId: newCafe._id }, JWT_SECRET, { expiresIn: '48h' });

        res.status(201).json({ message: "Cafe registered successfully", token, cafeId: newCafe._id });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const cafeLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const cafe = await Cafe.findOne({ email });

        if (!cafe) {
            return res.status(401).json({ message: "Email not registered" });
        }

        const isPasswordValid = bcryptjs.compareSync(password, cafe.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ cafeId: cafe._id }, JWT_SECRET, { expiresIn: '48h' });

        res.status(200).json({ token, cafeId: cafe._id });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getCafeDetails = async (req, res, next) => {
    const { cafeId } = req.params; 
    try {
        const cafe = await Cafe.findById(cafeId); 
        if (!cafe) {
            return res.status(404).json({ message: 'Cafe not found' });
        }
        res.status(200).json(cafe); 
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const addCategory = async (req, res) => {
    const { cafeId } = req.params; 
    const { category } = req.body; 

    try {
        const cafe = await Cafe.findById(cafeId);
        if (!cafe) {
            return res.status(404).json({ message: 'Cafe not found' });
        }
        cafe.categories.push(category);
        await cafe.save();
        res.status(200).json({ message: 'Category added successfully', categories: cafe.categories });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    const { cafeId } = req.params;
    const { category } = req.body; 
  
    try {
      const cafe = await Cafe.findById(cafeId);
      if (!cafe) {
        return res.status(404).json({ message: 'Cafe not found' });
      }
  
      const categoryIndex = cafe.categories.findIndex(cat => cat === category);
  
      if (categoryIndex === -1) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      cafe.categories.splice(categoryIndex, 1);
      await cafe.save();
  
      const dishes = await Menu.deleteMany({cafeId, dishCategory: category});
      console.log(dishes);

      res.status(200).json({ message: 'Category deleted successfully', categories: cafe.categories });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  
  

