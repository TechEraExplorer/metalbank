//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

export const postApplicantDetails = async (formData) => { 
  const response = await fetch("http://localhost:3001/applicant-details", {
    method: "POST", //POST API method. Checked posstman to see that it returned the correct JSON values
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData), // converts JS/JSON to raw string
  });

  return response; 
};