"use client";

import ChartScreen from "../chartScreen/ChartScreen";


const Home = () => {

  return (
    <div className="px-4 py-8">
      <h1 className="text-4xl font-bold mb-9 ">Welcome to Stock Sense</h1>
      <ChartScreen/>
    </div>
  );
};

export default Home;
