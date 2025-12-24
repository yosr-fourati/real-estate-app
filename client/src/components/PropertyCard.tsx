import { Link } from "react-router-dom";

interface Property {
  id: number;
  title: string;
  city: string;
  type: string;
  price: number;
  image: string;
}

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{property.title}</h3>
        <p className="text-gray-500">{property.city} • {property.type}</p>
        <p className="text-blue-700 font-bold mt-2">
          ${property.price.toLocaleString()}
        </p>
        <Link
          to={`/properties/${property.id}`}
          className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
