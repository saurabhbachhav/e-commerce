// Next.js API route for returning paginated products list
// Accepts an optional "page" query parameter (default: 1)
// Returns up to 12 products per page from a static product list

export default function handler(req, res) {
  console.log("API route hit");

  // Extract page from query params; default to 1
  const page = parseInt(req.query.page) || 1;
  const limit = 12; // Number of products per page
  const startIndex = (page - 1) * limit;

  // Static product data (example)
  const allProducts = [
    { id: 1, name: "Notebook", price: 5.99, image: "/images/notebook.jpg" },
    { id: 2, name: "Pen Set", price: 12.49, image: "/images/pen-set.jpg" },
    { id: 3, name: "Eraser", price: 0.99, image: "/images/eraser.jpg" },
    { id: 4, name: "Ruler", price: 1.49, image: "/images/ruler.jpg" },
    { id: 5, name: "Marker Set", price: 9.99, image: "/images/marker-set.jpg" },
    {
      id: 6,
      name: "Sticky Notes",
      price: 3.49,
      image: "/images/sticky-notes.jpg",
    },
    {
      id: 7,
      name: "Paper Clips",
      price: 1.99,
      image: "/images/paper-clips.jpg",
    },
    {
      id: 8,
      name: "Highlighter Set",
      price: 7.99,
      image: "/images/highlighter-set.jpg",
    },
    { id: 9, name: "Scissors", price: 4.49, image: "/images/scissors.jpg" },
    {
      id: 10,
      name: "Desk Organizer",
      price: 15.99,
      image: "/images/desk-organizer.jpg",
    },
    {
      id: 11,
      name: "Glue Stick",
      price: 2.49,
      image: "/images/glue-stick.jpg",
    },
    { id: 12, name: "Stapler", price: 8.99, image: "/images/stapler.jpg" },
    {
      id: 13,
      name: "Notebook Pack",
      price: 18.99,
      image: "/images/notebook-pack.jpg",
    },
    { id: 14, name: "Desk Lamp", price: 25.99, image: "/images/desk-lamp.jpg" },
    {
      id: 15,
      name: "Pencil Box",
      price: 5.49,
      image: "/images/pencil-box.jpg",
    },
    {
      id: 16,
      name: "Whiteboard",
      price: 19.99,
      image: "/images/whiteboard.jpg",
    },
    { id: 17, name: "Push Pins", price: 3.99, image: "/images/push-pins.jpg" },
    {
      id: 18,
      name: "Binder Clips",
      price: 6.49,
      image: "/images/binder-clips.jpg",
    },
    {
      id: 19,
      name: "Sketch Pad",
      price: 12.99,
      image: "/images/sketch-pad.jpg",
    },
    {
      id: 20,
      name: "Calculator",
      price: 14.99,
      image: "/images/calculator.jpg",
    },
    {
      id: 21,
      name: "Fountain Pen",
      price: 29.99,
      image: "/images/fountain-pen.jpg",
    },
    {
      id: 22,
      name: "Drawing Pencils",
      price: 10.99,
      image: "/images/drawing-pencils.jpg",
    },
    {
      id: 23,
      name: "Card Holder",
      price: 7.49,
      image: "/images/card-holder.jpg",
    },
    {
      id: 24,
      name: "Sticky Tabs",
      price: 4.99,
      image: "/images/sticky-tabs.jpg",
    },
  ];

  // Select products for the current page
  const paginatedProducts = allProducts.slice(startIndex, startIndex + limit);

  // Send the paginated products as JSON response
  res.status(200).json({ products: paginatedProducts });
}
