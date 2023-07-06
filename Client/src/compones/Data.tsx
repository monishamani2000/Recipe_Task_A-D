import { useState, useEffect } from "react";
import { trpc } from "../trpc";



const Value = () => {
  const [recipe, setRecipe] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const recipeList = await trpc.getRecipes.query();
      setRecipe(recipeList);
    } catch (error) {
      console.log(error);
    }
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cookingInstructions, setCookingInstructions] = useState("");
  const [price, setPrice] = useState("");

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      const newRecipe = { name, description, cookingInstructions,price };
      await trpc.createRecipes.mutate(newRecipe);

      fetchData();

      setName("");
      setDescription("");
      setCookingInstructions("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await trpc.deleteRecipe.mutate(recipeId);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [name, description, price, cookingInstructions]);





  
  return (
    <>
      <div>
        <table className="totaltable" border={1}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recipe.map((get_items) => (
              <tr key={get_items.id}>
                <td>{get_items.name}</td>
                <td>{get_items.description}</td>
                <td>{get_items.price}</td>
                <td>
                  <button
                    onClick={() => handleDeleteRecipe(get_items.id)}
                    className="but1 "
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form onSubmit={handleAddRecipe}>
          <input
            type="text"
            placeholder="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Recipe Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Cooking Instructions"
            value={cookingInstructions}
            onChange={(e) => setCookingInstructions(e.target.value)}
          />
           <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button type="submit" className="but1">
            Add Recipe
          </button>
        </form>
      </div>
    </>
  );
};

export default Value;
