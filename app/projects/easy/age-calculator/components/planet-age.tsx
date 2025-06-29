interface PlanetAgeProps {
  name: string,
  color: string,
  age: number
}

export const PlanetAge = ({ name, color, age }: PlanetAgeProps) => (
  <div className="flex items-center gap-3">
    <div className={`w-10 h-10 ${color} rounded-full flex-shrink-0`}></div>
    <div>
      <p>Age on {name}</p>
      <p className="text-2xl text-blue-500 font-medium">{age.toFixed(2)} years</p>
    </div>
  </div>
);