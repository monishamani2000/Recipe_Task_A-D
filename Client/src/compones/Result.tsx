import { Link } from 'react-router-dom';
import './ui.css'

export function Result(){
    return(
        <>
        <div className="last_pop">
            <div className="">
                <p>Order Complete,Your food will arrive soon!!</p>
            </div>

            <div className="last_but">
                <Link to ='/'><button className="close">Close</button></Link>
                
            </div>
        </div>
        
        </>
    )
}