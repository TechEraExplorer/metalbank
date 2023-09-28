const ALLOYAUTHKEY = process.env.ALLOYAUTHKEY; 

export const postEvaluations = async (payload) => {
    const response = await fetch("https://sandbox.alloy.co/v1/evaluations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": ALLOYAUTHKEY
      },
      body: JSON.stringify(payload),
    });
  
    return response;
};