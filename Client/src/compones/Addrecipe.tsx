import { useState } from 'react';
import { trpc } from '../trpc';

const CreateRecipeForm = ({addRecipe}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cookingInstructions, setCookingInstructions] = useState('');
  const [price, setPrice] = useState('');
  const [id,setId] = useState("")

  const handleAddRecipe = async (e) => {
    e.preventDefault();

    try {
      await addRecipe({
        id: parseInt(id),
        name,
        description,
        cookingInstructions,
        price: parseInt(price), // Convert the price to a number
        ingredientIds: [1], // Provide the desired ingredient IDs here
      });
      console.log('Recipe created successfully!');
      // Reset the form
      setName('');
      setDescription('');
      setCookingInstructions('');
      setPrice('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className='new font-semibold'>Create New Recipe</h2>
      <form onSubmit={handleAddRecipe} className='new_item'>
      <input
          type="text"
          placeholder='RecipeId'
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder='RecipeName'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          value={description}
          placeholder='Description'
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          value={cookingInstructions}
          placeholder='Cooking Instructions'
          onChange={(e) => setCookingInstructions(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className='price_box'
        />

        <button type="submit" className='but12'>Create Recipe</button>
      </form>
    </div>
  );
};

export default CreateRecipeForm;
