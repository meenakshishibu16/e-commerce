const CONTACT_IMG = "https://static.vecteezy.com/system/resources/thumbnails/051/166/491/small/communication-concept-with-email-message-box-and-contacts-icons-e-mail-marketing-customer-support-counseling-and-support-hotline-connection-with-modern-network-technology-contact-us-free-photo.jpg";

export default function Contact(){
  return (
    <div>
      <div className="sectionTitle">Contact Us</div>

      <div className="split">
        <div className="imgCard" style={{minHeight:300}}>
          <img src={CONTACT_IMG} alt="Contact UrbanClick.Co" />
        </div>

        <div className="panel">
          <h3 style={{marginTop:0}}>Our Store</h3>
          <div className="small" style={{lineHeight:1.9}}>
            54709 Willms Station<br/>
            Suite 350, Washington, USA<br/><br/>
            Tel: (415) 555-0132<br/>
            Email: admin@urbanclick.co.com
          </div>

          <div className="hr" />

          <h3 style={{margin:"0 0 8px"}}>Careers at UrbanClick.Co</h3>
          <div className="small" style={{lineHeight:1.8}}>
            Learn more about our teams and job openings. (Demo content)
          </div>

          <button className="btn" style={{maxWidth:220}}>
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
}
