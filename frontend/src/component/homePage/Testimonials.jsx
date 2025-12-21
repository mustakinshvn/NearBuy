import { Star } from "lucide-react";

const Testimonials = () => {

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Customer',
      content: 'NearBuy has transformed my shopping experience. Finding local vendors and getting fresh products has never been easier!',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Mike Chen',
      role: 'Small Business Owner',
      content: 'As a vendor, NearBuy helped me reach more customers in my area. The platform is intuitive and reliable.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emma Davis',
      role: 'Busy Professional',
      content: 'The fast delivery and quality products make NearBuy my go-to shopping platform. Highly recommended!',
      rating: 5,
      avatar: 'ED'
    }
  ];

  return (
    <section aria-label="Customer testimonials" className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">What Our Customers Say</h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Don't just take our word for it — real stories from our community.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, idx) => (
          <article
            key={idx}
            className="bg-white/6 backdrop-blur-sm border border-white/8 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            role="group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold">{t.avatar}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">{t.name}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm">{t.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1" aria-hidden>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400" />
                ))}
              </div>
            </div>

            <blockquote className="text-slate-200 mb-4 leading-relaxed text-sm sm:text-base">
              <span className="text-3xl leading-none align-top text-slate-300 mr-2">“</span>
              {t.content}
              <span className="text-3xl leading-none align-bottom text-slate-300 ml-2">”</span>
            </blockquote>

            <figcaption className="text-slate-400 text-xs">Verified customer</figcaption>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;