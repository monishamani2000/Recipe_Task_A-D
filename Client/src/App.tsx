import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './compones/Layout'
// import Value from './compones/Data'
import CustomerForm from './compones/cutomer';
import { Result } from './compones/Result';
import CreateRecipeForm from './compones/Addrecipe';
import { trpc } from './trpc';



// eslint-disable-next-line react-refresh/only-export-components
function App(): JSX.Element  {

 
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />} />
                    <Route path='/Result' element={<Result />} />
                    <Route path='/customer' element={<CustomerForm />} />

                    
                </Routes>
            </BrowserRouter>
        </>
    )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />)











