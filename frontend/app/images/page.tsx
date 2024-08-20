import { Navbar } from "../components/Navbar";
import  { All}   from "../components/All";

export default function Images(){
    return(
        <>
        <Navbar />
        <div className="pt-4 min-h-screen"  style={{ backgroundImage: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)' }}><All /></div>
        </>
    );
 
};