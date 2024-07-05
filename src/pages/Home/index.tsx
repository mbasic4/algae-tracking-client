export const HomePage = () => {
  return (
    <div
      className="h-full justify-center bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('http://localhost:8080/algae_background.webp')"}}>
        <div className="h-full max-w-screen-xl mx-auto p-4 content-center">
          <p className="text-xl text-white text-bold mb-5" style={{ textShadow: "3px 2px 2px #111827" }}>
          Algae pollution is becoming an increasingly prevalent issue in our environment, with harmful algal blooms harming marine life and ecosystems. These blooms are often caused by excessive nutrient runoff from agriculture and urban areas, leading to an overgrowth of algae that can deplete oxygen levels and create dead zones in bodies of water.
          </p>
          <p className="text-xl text-white text-bold mb-5" style={{ textShadow: "3px 2px 2px #111827" }}>
          As biologists and scientists, it is crucial for us to monitor and measure algae pollution to understand the extent of the problem and develop effective management strategies. By conducting water quality testing, collecting and analyzing algae samples, and studying the impacts of pollution on aquatic organisms, we can help mitigate the negative effects of algae pollution and protect our water resources for future generations.
          </p>
          <p className="text-xl text-white text-bold" style={{ textShadow: "3px 2px 2px #111827" }}>
          We invite all biologists and scientists to join in this important research effort to measure algae pollution and contribute to the conservation of our precious aquatic ecosystems. Together, we can make a difference in combating algae pollution and preserving the health and integrity of our waters. Let's work together to keep our waters clean and safe for all living organisms.
          </p>
        </div>
    </div>
  )
}
