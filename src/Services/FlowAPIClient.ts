const BASE_URL = "http://localhost:8000";

const flowAPI = {
  async getData() {
    const res = await fetch(`${BASE_URL}/flow/data`);
    
    if (!res.ok) throw new Error("Status " + res.status);
    return res.json();
  },
};

export default flowAPI;
