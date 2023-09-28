//EXPRESS NODE BACKEND
import express from 'express'; // express framework
import cors from 'cors'; // cross origin resource sharing, if frontend was on different domain than the backend
import 'dotenv/config'; // env variables in env file
import US_STATES from './usa-states.json' assert { type: "json" }; // JSON state list for validation
import { postEvaluations } from './apis/postEvaluations.js'; // API call to alloy

const app = express();

// Apply middlwares e.g. CORS and JSON endpoint. when a req comes in, it hits these first before ocntinuing into the functions/handlers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen('3001', () => // hardcode port
  console.log('Example app listening on port 3001!'),
);

//req is from FE, res to FE
const postApplicantDetails = async (req, res) => {
  try {
    const requestBody = validateApplicantDetails(req.body); // validations of details and json mappings with alloy api specs
    const alloyResponse = await postEvaluations(requestBody); //posting a req to the alloy evals backend, await response (should be of 200=299)
    if (!alloyResponse.ok) {
      const alloyError = await alloyResponse.json();
      throw new Error(`Error from Alloy API: ${JSON.stringify(alloyError)}`)
    }

    const evaluations = await alloyResponse.json(); //if ok then carry on 
    
    if (!evaluations.summary) { //still returned 200, checkif summary exists
      throw new Error('Error retrieving summary/outcome from Alloy API.'); // error if not success
    }
    
    const response = {
      outcome: evaluations.summary.outcome
    };

    res.send(response); // 200 ok response is body
  } catch (error) {
    console.error(error);
    res.status(400).send({error: error.message});
  }
};

//on
app.post('/applicant-details', postApplicantDetails);

const validateApplicantDetails = (body) => {
  if (!body || !body.address) { // checks if the body and address exists in json, if fails, then invalid
    throw new Error("Invalid request body.");
  }

  // add validation for mandatory address line 1
  if(!body.address.line1){
    throw new Error("Invalid address line 1");
  }

  // add validation for mandatory email address
  if(!body.emailAddress){
    throw new Error("Invalid email address")
  }

  // Phone number in alloy api is mandatory? Might error
  // Phone number didnt error out but is defined as mandatory documentation?

  if (!Object.keys(US_STATES).includes(body.address.state)) {
    throw new Error("Invalid address state.");
  }

  if (body.address.country !== "US") {
    throw new Error("Invalid country, needs to be US.");
  }

  if (Number.isNaN(Date.parse(body.dateOfBirth))) {
    throw new Error("Invalid date of birth.");
  }

  /** Regex 
   * \d matches a digit (equivalent to [0-9])
   * {9} matches the previous token exactly 9 times
   * $ asserts position at the end of the string, or before the line terminator right at the end of the string (if any)
   * /g checks all matches globally, in this case just 9 digit string
   */
  const ssn = `${body.ssn}`;
  if (!ssn.match(/^\d{9}$/g)) {
    throw new Error("Invalid SSN.");
  }

  // Map body to Alloy request format
  // Apply aloy JSon to request values that has been defined on frontend and backend
  const validatedBody = {
    name_first: body.firstName,
    name_last: body.lastName,
    address_line_1: body.address.line1,
    address_line_2: body.address.line2,
    address_city: body.address.city,
    address_state: body.address.state,
    address_postal_code: body.address.postal,
    address_country_code: body.address.country,
    document_ssn: body.ssn,
    email_address: body.emailAddress,
    birth_date: body.dateOfBirth
  };

  return validatedBody;
};



// {
//   "firstName": "",
//   "lastName": "",
//   "address": {
//     "line1": "",
//     "line2": "",
//     "city": "",
//     "state": "",
//     "postal": "",
//     "country": "",
//   },
//   "ssn": "",
//   "emailAddress": "",
//   "dateOfBirth": ""
// }

// {
//   "name_first": body.firstName,
//   "name_last": body.lastName,
//   "address_line_1": body.address.line1,
//   "address_line_2": body.address.line2,
//   "address_city": body.address.city,
//   "address_state": body.address.state,
//   "address_postal_code": body.address.postal,
//   "address_country_code": body.address.country,
//   "document_ssn": body.ssn,
//   "email_address": body.emailAddress,
//   "birth_date": body.dateOfBirth
// }