import { Navbar } from "../components/Navbar";
import {Stat} from "../components/Stat"
import ClusterSelector  from "../components/ClusterSelector";

export default function Statistics(){
    return(
        <>
        <Navbar />
        <ClusterSelector />
        <div className="pt-4 min-h-screen"  style={{ backgroundImage: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)' }}><Stat /></div>
        </>
    );
 
};