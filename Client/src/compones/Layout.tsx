import img from '../Image.jpeg';
import '../index.css';
import { trpc } from '../trpc';
import './ui.css';
import  { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom';
import CreateRecipeForm from './Addrecipe';



const Layout = () => {

    const [recipe, setRecipe] = useState([]);



    const [cart_counter, setCart_Counter] = useState(0)
    const addCart = (e) => {
        e.preventDefault()
        setCart_Counter(count => count + 1)
    }

    const updatedRecipe = useMemo(() => {
        return recipe.map((item) => ({
            ...item,
            counter: item.counter || 0
        }));
    }, [recipe]);

    const handleIncreaseQuantity = (itemId) => {
        const item = recipe.find((get_items) => get_items.id === itemId);

        if (item) {
            // Increment the quantity by 1
            const updatedItem = {
                ...item,
                counter: item.counter + 1
            };

            const itemIndex = recipe.findIndex((get_items) => get_items.id === itemId);

            const updatedRecipe = [
                ...recipe.slice(0, itemIndex),
                updatedItem,
                ...recipe.slice(itemIndex + 1)
            ];

            setRecipe(updatedRecipe);
        }
    };
    // Decrement the quantity by 1
    const handleDecreaseQuantity = (itemId) => {
        const item = recipe.find((get_items) => get_items.id === itemId);

        if (item && item.counter > 0) {
            const updatedItem = {
                ...item,
                counter: item.counter - 1
            };

            const itemIndex = recipe.findIndex((get_items) => get_items.id === itemId);

            const updatedRecipe = [
                ...recipe.slice(0, itemIndex),
                updatedItem,
                ...recipe.slice(itemIndex + 1)
            ];

            setRecipe(updatedRecipe);
        }
    };





    //Popup create _______________________________________________________________
    const [popup, setPopup] = useState(false);
    const showPopup = () => {
        setPopup(true)
    }
    const closePopup = () => {
        setPopup(false)
    }


    // _____________________________________________


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const recipeList = await trpc.getRecipes.query();
            const updatedRecipeList = recipeList.map((item) => ({
                ...item,
                counter: 0
            }));
            setRecipe(updatedRecipeList);
        } catch (error) {
            console.log(error);
        }
    };



    //   _____________________
    const handleDeleteRecipe = async (recipeId) => {
        try {
            await trpc.deleteRecipe.mutate(recipeId);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };
    const addRecipe = async (newRecipe) => {
        try {
          // Call API to add new recipe
          await trpc.addRecipes.mutate(newRecipe);
      
          // Fetch updated recipe list
          await fetchData();
        } catch (error) {
          console.log(error);
        }
      };



    return (
        <>
            <div className='w-full'>
                <div className='bg'>
                    {/* _________________popup____ */}
                    {popup &&
                        <div className='pop'>
                            <div className=' pop-2'>
                                <div className='pop-3'>
                                    <ul>
                                        <li className='list1'>
                                            <div className='left'>
                                                <div className='order'>
                                                    {updatedRecipe.map((get_items) => {
                                                        if (get_items.counter > 0) {
                                                            return (
                                                                <>
                                                                    <div className='get_name'>
                                                                        <div key={get_items.id} className='pop1'>
                                                                            <div className='font-bold text-xl'>
                                                                                {get_items.name} x {get_items.counter}</div>

                                                                            <div className='rate'>${get_items.counter * get_items.price}</div>
                                                                        </div>

                                                                        <div className='card_add'>
                                                                            <button className='decres_in' type='button' onClick={() => handleDecreaseQuantity(get_items.id)}>
                                                                                -
                                                                            </button>
                                                                            <button className='decres font-bold ' type='button' onClick={() => handleIncreaseQuantity(get_items.id)}>
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                </>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                    <hr className='w-full ' style={{ color: "#ad5502" }}></hr>
                                                    <h2 className='text-2xl font-semibold last_amount'>Total Amount </h2>
                                                    <h2 className='text-2xl font-semibold last_amount' style={{ color: "#ad5502" }}>${recipe.reduce((total, get_items) => total + get_items.counter * get_items.price, 0)}</h2>
                                                </div>
                                            </div>
                                        </li>

                                    </ul>

                                </div>
                                <div className='click_but'>
                                    <button onClick={closePopup} className='font-semibold text-large '>Close </button>
                                    <Link to="./customer">
                                        <button className='sub font-semibold text-large'> Order</button>
                                    </Link></div>
                            </div>
                        </div>
                    }
                    {/* _______________head___ */}

                    <header className='flex flex-row justify-between h-20 p-4 text-center' style={{ backgroundColor: "#991B1B" }}>
                        <h1 className='text-white text-2xl font-bold'>ReactMeals</h1>
                        <button className='flex flex-row gap-5 outline-none text-white justify-center rounded-3xl px-8 p-2 bg-red-900 hover:bg-red-600' onClick={showPopup}>
                            <span><svg className='h-8 w-8' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg></span>
                            <span>Your Cart</span><b><span className='count '>{cart_counter}</span></b></button>
                    </header>

                    <main>
                        <img src={img} className='w-full h-96' />

                        <section className='meals'><h2 className='food'><b>Delicious Food, Delivery To You</b></h2>
                            <p className='p-4'>Choose your favorite meal from our broad selection of available meals and enjoy a delicious lunch or dinner at home.</p>
                            <p>All our meals are cooked with high-quality ingredients, just-in-time and of course by experenced chefs!</p></section>


                        <section className='add'>
                            <div className='card'>
                                <ul>
                                    <li className='list1'>
                                        <div className='left'>
                                            <div className='order'>
                                               
                                                     {updatedRecipe.map((get_items) => (
                                                    <div key={get_items.id}>
                                                        <div className='font-bold'></div>
                                                        <div className='font-semibold foodname '>
                                                            {get_items.name}
                                                        </div>
                                                        <div className=''>
                                                            <i>{get_items.description}</i>
                                                        </div>
                                                        <div className='rate'>${get_items.price}</div>
                                             
                                                        {/* <button onClick={() => handleDeleteRecipe(get_items.id)} className="but1">
                                                    x
                                                </button> */}
                                              

                                                        <form className='form1'>
                                                            <div className='div1'>
                                                                <label className='font-bold mr-2'>Amount</label>
                                                                <div className='plus'>
                                                                    <span>{get_items.counter}</span>
                                                                </div>
                                                                <button className='but1' type='button' onClick={() => handleDecreaseQuantity(get_items.id)}>
                                                                    -
                                                                </button>
                                                                <button className='but1' type='button' onClick={() => handleIncreaseQuantity(get_items.id)}>
                                                                    +
                                                                </button>
                                                            </div>
                                                            <button className='butt' onClick={addCart}>+ Add</button>
                                                        </form>
                                                    </div>
                                                ))}


                                            </div>
                                        </div>
                                    </li>

                                    <li className='listadd'>
                                        <CreateRecipeForm  addRecipe={addRecipe}/>
                                    </li>
                                </ul>
                            </div>
                        </section>

                    </main>
                   
                        {/* <button className='but11'> Available Items</button> */}
                        <div className="cart-icon">
                            <span className="cart-counter">{cart_counter}</span>
                        </div>
                    
                </div>
            </div>

        </>

    )
}
export default Layout;