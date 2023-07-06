
import  { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './customer.css';
import { trpc } from '../trpc';

const isEmpty = (value: string) => value.trim() === '';
const isFiveChars = (value) => value.trim().length === 5;

const CustomerForm = (props) => {
  const [formValidate, setFormValidate] = useState({
    name: true,
    street: true,
    city: true,
    post: true,
  });

  const navigate = useNavigate()

  const nameRef = useRef();
  const streetRef = useRef();
  const postRef = useRef();
  const cityRef = useRef();

  const confirmHandler = async (event) => {
    event.preventDefault();

    const inputName = nameRef.current.value;
    const inputStreet = streetRef.current.value;
    const inputPost = postRef.current.value;
    const inputCity = cityRef.current.value;

    const inputNameValid = !isEmpty(inputName);
    const inputStreetValid = !isEmpty(inputStreet);
    const inputPostValid = !isEmpty(inputPost) && isFiveChars(inputPost);
    const inputCityValid = !isEmpty(inputCity);

    setFormValidate({
      name: inputNameValid,
      street: inputStreetValid,
      post: inputPostValid,
      city: inputCityValid,
    });

    const formValid =
      inputNameValid &&
      inputStreetValid &&
      inputPostValid &&
      inputCityValid;

    if (!formValid) {
      return;
    }

    try {
      await trpc.createOrder.mutate({
        name: inputName,
        street: inputStreet,
        post: inputPost,
        city: inputCity,
      });
      navigate("/Result")
      console.log('Order created successfully!');
      // Handle any further actions upon successful order creation

    } catch (error) {
      console.error('Error creating order:', error);
      // Handle error scenarios
    }
  };

  return (
    <>
      <div className="main_1">
        <div className="main_2">
          <div className="head1">
            <span   >Your Details</span>
          </div>

          <form className="main_3" onSubmit={confirmHandler}>
            <div className={`div_d ${formValidate.name ? '' : 'invalid'}`}>
              <label  style={{ color: "#ad5502" }}>Name</label>
              <input type="text" id="name" ref={nameRef} required />
              {!formValidate.name && <p>Please enter a name.</p>}
            </div>

            <div className={`div_b ${formValidate.street ? '' : 'invalid'}`}>
              <label  style={{ color: "#ad5502" }}>Address</label>
              <input type="text" id="street" ref={streetRef} required />
              {!formValidate.street && <p>Please enter a street.</p>}
            </div>

            <div className={`div_c ${formValidate.post ? '' : 'invalid'}`}>
              <label  style={{ color: "#ad5502" }}>Postal Code</label>
              <input type="text" id="post" ref={postRef} required />
              {!formValidate.post && <p className='post_err'>Please enter a valid postal code.</p>}
            </div>

            <div className={`div_d ${formValidate.city ? '' : 'invalid'}`}>
              <label  style={{ color: "#ad5502" }}>City</label>
              <input type="text" id="city" ref={cityRef} required />
              {!formValidate.city && <p>Please enter a valid city.</p>}
            </div>

            <div className="div_e">
              {/* <Link to="/Result"> */}
                <button className="submit">Confirm</button>
              {/* </Link> */}

              <Link to="/">
                <button type="button" className="cancel">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CustomerForm;























