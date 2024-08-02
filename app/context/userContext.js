import { createContext, useState } from "react";

export const userContext=createContext()
export default function UserContext({children}){
    const userdata=localStorage.getItem('user')
    const [user,setUser]=useState(userdata?JSON.parse(userdata):{
        username:'',
        email:'',
        fullname:'',
        id:'',
        phone:'',
        img_url:'',
        address:''
    })
    return(
        <userContext.Provider value={[user,setUser]}>
            {children}
        </userContext.Provider>
    )
}