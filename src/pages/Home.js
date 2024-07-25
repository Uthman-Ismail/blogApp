import React from "react";
import CardContainer from "../component/CardContainer";
import { cardData } from "../data";
import About from "./About";

const Home = () => {
    return (
        <div>
            <CardContainer cards={cardData} />
            <About />
        </div>
    )
}

export default Home;