const ABOUT_IMG = "https://img.freepik.com/free-photo/lifestyle-people-office_23-2149173732.jpg?semt=ais_hybrid&w=740&q=80";

export default function About(){
  return (
    <div>
      <div className="sectionTitle">About Us</div>

      <div className="split">
        <div className="imgCard" style={{minHeight:360}}>
          <img src={ABOUT_IMG} alt="About UrbanClick.Co" />
        </div>

        <div className="panel">
          <div style={{lineHeight:1.8, color:"#111827"}}>
            <p>
              <b>UrbanClick.Co</b> was built with a simple idea: make shopping feel calm, minimal, and fast.
              We focus on curated products, clean UI, and a seamless checkout experience.
            </p>
            <p>
              This demo store includes a real e-commerce flow: product browsing, size variants, quantity
              selection, wishlist, secure payments (Stripe), COD, orders, and verified-buyer reviews.
            </p>

            <div className="hr" />
            <b>Our Mission</b>
            <p className="small" style={{lineHeight:1.8, marginTop:8}}>
              Empower customers with a smooth shopping experience — from browsing to delivery —
              with confidence and clarity at every step.
            </p>
          </div>
        </div>
      </div>

      <div className="sectionTitle" style={{marginTop:44}}>Why Choose Us</div>
      <div className="sectionSub">
        Built like a real store — minimal visuals, fast pages, and production-style architecture.
      </div>

      <div className="features">
        <div className="featureCard">
          <b>Quality Assurance</b>
          <div className="small" style={{lineHeight:1.7}}>
            Clean data model, safe checkout flow, and verified review rules (buyers only).
          </div>
        </div>
        <div className="featureCard">
          <b>Convenience</b>
          <div className="small" style={{lineHeight:1.7}}>
            Wishlist favorites, choose size, set quantity, and order in a few steps.
          </div>
        </div>
        <div className="featureCard">
          <b>Support</b>
          <div className="small" style={{lineHeight:1.7}}>
            Clear order history and detail pages to track purchases smoothly.
          </div>
        </div>
      </div>
    </div>
  );
}
