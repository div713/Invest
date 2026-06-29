import Hero from "./Hero";
import Pricing from "./Pricing";
import Stats from "./Stats";
import Openaccount from "../Openaccount";
import Login from "../Login";

function Homepage() {
    return ( 
        <div className="mt-2">
            <Hero></Hero>
            <Stats></Stats>
            <Pricing></Pricing>
            <Login></Login>
            <Openaccount></Openaccount>
        </div>
    );
}

export default Homepage;