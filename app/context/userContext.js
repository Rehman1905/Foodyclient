import { createContext, useState, useEffect } from "react";

export const userContext = createContext();

export default function UserContext({ children }) {
  const [user, setUser] = useState({
    username: '',
    email: '',
    fullname: '',
    id: '',
    phone: '',
    img_url: '',
    address: ''
  });

  useEffect(() => {
    let userdata
    if (window) {
      userdata = localStorage?.getItem('user');
    }
    if (userdata) {
      setUser(JSON.parse(userdata));
    }
  }, []);

  return (
    <userContext.Provider value={[user, setUser]}>
      {children}
    </userContext.Provider>
  );
}
