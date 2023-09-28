//REACT FRONTEND
import React from 'react';
import './app.css';
import { useState } from "react";
import { postApplicantDetails } from './apis/postApplicantDetails';

// Comment message after on submit
const OUTCOME_MESSAGES = {
  "Approved": (<>
    <label className="outcome__approved">Success, your account has been Approved</label>
    <div className="card">
      <i className="checkmark">✓</i>
    </div>
  </>),
  "Manual Review": (<label className="outcome__review">Thanks for submitting your application, we’ll be in touch shortly</label>),
  "Denied": (<label className="outcome__denied">Sorry, your application was not Successful</label>)
};

//Form Data in JSON 
export default function MetalApp() {
  // React hook useState
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal: "",
      country: "US",
    },
    ssn: "",
    emailAddress: "",
    dateOfBirth: ""
  });
  
  // Use state for success/fail outcome: Values defined in OUTCOME_MESSAGES, submitted/handled on handle submit
  const [outcome, setOutcome] = useState("");

  // spread operator: copying old values currently in form data JSON, overriding with whatever the [name] key value is. 
  // Hardcoded US  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // To handle address change: if state or country set to upper case
  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    let val = value;
    if (name === "state" || name === "country") { //overriding val to uppercase
      val = value.toUpperCase();
    }
    setFormData((prevFormData) => ({ //updates on screen val with new values replacing the old address
      ...prevFormData,
      address: {
        ...prevFormData.address,
        [name]: val
      }
    }));
  };

  // Submit function
  const handleSubmit = async (event) => { //asynchronous function e.g. calling the api (postApplicantDetails) where await is, we want to wait for the response, pause exedcution and wait for it to return and doesnt blovk application
    event.preventDefault();
    console.log(formData); // console log
    try {
      const response = await postApplicantDetails(formData); //postApplicantDetails is outside this application, can call function while executing other calls. 
      console.log(response);
      const json = await response.json(); // convert the post ReadableStream built in function
      if (response.ok) { // ok: 200-299 http code
        setOutcome(OUTCOME_MESSAGES[json.outcome]);
      } else {
        throw new Error(JSON.stringify(json)); // throw error to catch below and pop up in screen
      }
    } catch (error) {
      alert(`Error occurred calling API: ${error.message}`); //throw alert
    }
    // alert(`FirstName: ${formData.firstName},LastName: ${formData.lastName}, Address: ${formData.address}, Email: ${formData.emailAddress}`
    // );
};

  return (
    <div class="form-wrap"><h1 className="metaltext">Metal Bank</h1>
    {/* If no outcome form is displayed on submit form disappears */}
    { !outcome ? 
    // Outcome submit ternary ? 
    // Show form otherwise hide form on submit at end
    
    <form onSubmit={handleSubmit}>
      {/* Some fields are mandatory,
          State set to 2 chars,
          SSN max 9 chars,
          email regex validated,
       */}
        <label htmlFor="firstname">First Name</label>
        <input class="input" type="text" required id="firstname" name="firstName" title="Enter First Name" placeholder="First Name" value={formData.firstName} onChange={handleChange}/>

        <label htmlFor="lastname">Last Name</label>
        <input class="input" type="text" required id="lastname" name="lastName" title="Enter Last Name" placeholder="Last Name" value={formData.lastName} onChange={handleChange}/>

        <label htmlFor="line1">Address Line 1</label>
        <input class="input" type="text" required id="line1" name="line1" placeholder="Address Line 1" value={formData.address.line1} onChange={handleAddressChange}/>

        <label htmlFor="line2">Address Line 2</label>
        <input class="input" type="text" id="line2" name="line2" placeholder="Address Line 2" value={formData.address.line2} onChange={handleAddressChange}/>

        <label htmlFor="city">City</label>
        <input class="input" type="text" required id="city" name="city" placeholder="City" value={formData.address.city} onChange={handleAddressChange}/>

        <label htmlFor="state">State</label>
        <input class="input" type="text" maxLength="2" required id="state" name="state" placeholder="State" value={formData.address.state} onChange={handleAddressChange}/>
        <small>Enter only 2 characters for your State</small>

        <label htmlFor="postal">Postal Code</label>
        <input class="input" type="text" required id="postal" name="postal" placeholder="Post Code" value={formData.address.postal} onChange={handleAddressChange}/>

        <label htmlFor="country">Country</label>
        <input class="input" disabled type="text" required id="country" name="country" placeholder="US" value={formData.address.country} onChange={handleAddressChange}/>

        <label htmlFor="ssn">SSN</label>
        <input class="input" type="text" maxLength="9" pattern="[0-9]*" required id="ssn" name="ssn" placeholder="123456789" title="Enter a 9-digit SSN with only numeric characters" value={formData.ssn} onChange={handleChange}/>

        <label htmlFor="email">Email</label>
        <input class="input" type="email" pattern="/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i" required id="email" name="emailAddress" placeholder="John@Metalbank.com" value={formData.emailAddress} onChange={handleChange}/>

        <label htmlFor="dateOfBirth">Date of Birth</label>
        <input class="input" type="date" required id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}/>

      <button type="submit" class="button" value="submit">Submit</button>
    </form>
    : outcome
    }
    </div>
  );
}

//   firstName: "",
//   lastName: "",
//   address: {
//     line1: "",
//     line2: "",
//     city: "",
//     state: "",
//     postal: "",
//     country: "",
//   },
//   ssn: "",
//   emailAddress: "",
//   dateOfBirth: ""