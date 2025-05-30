import React from "react";
import PropTypes from "prop-types";
import { Product } from "../types/types";

interface WishlistProps {
  items: Product[];
}

const Wishlist: React.FC<WishlistProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return <div>Your wishlist is empty.</div>;
  }

  return (
    <div>
      <h2>Your Wishlist</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <img src={item.image} alt={item.name} style={{ width: "100px" }} />
            <div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>${item.price}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Adding prop-types for validation (optional)
Wishlist.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
};

export default Wishlist;
