import Menu from "../models/menu.model.js";

export const addDish = async (req, res, next) => {
    const cafeId = req.params.cafeId;
    const {dishName, dishDescription, dishPrice, dishCategory, dishType} = req.body;
    try {
        const newMenu = Menu({cafeId, dishName, dishDescription, dishPrice, dishCategory, dishType});
        await newMenu.save();
        res.status(201).json({message: "Dish added successfully"});
    } catch(error) {
        return res.status(400).json({message: error.message});
    }
}

export const getMenu = async (req, res, next) => {
    const { cafeId } = req.params;
    try {
      const dishes = await Menu.find({ cafeId });
      if (!dishes || dishes.length === 0) {
        return res.status(404).json({ message: "No dishes found for this cafe" });
      }
      return res.status(200).json({ dishes });
    } catch (error) {
      console.error("Error fetching dishes:", error);
      return res.status(500).json({ message: "Error fetching dishes", error });
    }
  };
  

export const deleteDish = async (req, res) => {
    const { cafeId } = req.params; 
    const { dishname, dishCategory } = req.body;  

    try {
        const deletedDish = await Menu.findOneAndDelete({
            cafeId, 
            dishName: { $regex: new RegExp(`^${dishname}$`, 'i') }, 
            dishCategory: { $regex: new RegExp(`^${dishCategory}$`, 'i') } 
        });

        if (!deletedDish) {
            return res.status(404).json({ message: 'Dish not found' });
        }

        res.status(200).json({ message: 'Dish deleted successfully', deletedDish });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDishStatus = async (req, res) => {
    const { cafeId, dishName, dishCategory } = req.params;

    try {
        const dish = await Menu.findOne({
            cafeId, 
            dishName: { $regex: new RegExp(dishName.trim(), 'i') },  
            dishCategory: { $regex: new RegExp(dishCategory.trim(), 'i') }
        });

        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        
        return res.status(200).json({ dishStatus: dish.dishStatus });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



export const updateDishStatus = async (req, res) => {
    const { cafeId } = req.params; 
    const { dishName, dishCategory, dishStatus } = req.body;

    try {
        const dish = await Menu.findOne({ cafeId, dishName, dishCategory });
        
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' }); 
        }

        dish.dishStatus = dishStatus;
        await dish.save();
        res.status(200).json({ message: 'Updated the availability of the dish', dish });
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};




  

  




