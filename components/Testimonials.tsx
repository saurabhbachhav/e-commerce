"use client";

const testimonials = [
  {
    id: 1,
    name: "Emma Johnson",
    role: "Happy Customer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Spargen made shopping so easy and affordable! I found exactly what I needed at great prices.",
  },
  {
    id: 2,
    name: "Michael Lee",
    role: "Verified Buyer",
    avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    text: "Amazing service and fast delivery. The user experience is smooth and intuitive.",
  },
  {
    id: 3,
    name: "Sophia Patel",
    role: "Regular Shopper",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "I love the variety of products and the helpful search feature. Highly recommend Spargen!",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 transition-colors   border-t border-b border-blue-200 dark:border-blue-700 pt-8  duration-500">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400 mb-12 text-center transition-colors duration-500">
          What Our Customers Say
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {testimonials.map(({ id, name, role, avatar, text }) => (
            <div
              key={id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-lg hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-full mb-4 object-cover"
              />
              <p className="text-gray-700 dark:text-gray-300 italic mb-4 transition-colors duration-500">
                "{text}"
              </p>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 transition-colors duration-500">
                {name}
              </h3>
              <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-500">
                {role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
