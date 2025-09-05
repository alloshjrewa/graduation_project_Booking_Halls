import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [contact, setContact] = useState({ email: "", title: "", message: "" });

const handleContactChange = (e) => {
  setContact({ ...contact, [e.target.name]: e.target.value });
};

const handleContactSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:8081/api/contactUs", null, {
      params: contact, // matches @RequestParam in your Spring backend
    });

    toast.success("Message sent successfully!");
    setContact({ email: "", title: "", message: "" }); // reset form
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message. Please try again later.");
  }
};

  

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      if (!storedUser) return;

      // Assuming user object has "id"
      const response = await axios.get(`http://localhost:8081/api/notifications/${storedUser.username}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  fetchNotifications();
}, []);

  useEffect(() => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  setCartItems(cart);
}, [showCartSidebar]);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    setIsLoggedIn(!!storedUser);
  }, []);
  

  const handleLogout = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  localStorage.removeItem('cart');
  localStorage.removeItem('bookingId');
  localStorage.removeItem('finalPrice');
  setIsLoggedIn(false);
  navigate('/');
  window.location.reload();
};
 const calculateTotalPrice = () => {
  return cartItems.reduce((total, item) => {
    const price = item.finalPrice || item.price;
    return total + parseFloat(price); 
  }, 0);
};
const buttonStyle = {
  background: 'white',
  color: '#333',
  padding: '12px',
  marginBottom: '15px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px'
};



  return (
    <>
    <ToastContainer />
      <section className="banner" role="banner" id="home" >
        <header id="header">
          <div className="header-content clearfix" style={{ height: '60px' }} >
            <a className="logo" style={{ marginTop: '15px' }} href="/">JoyNest💍</a>
            <nav className="navigation" role="navigation" style={{ marginTop: '20px' , marginBottom : '8px'  }}>
              <ul className="primary-nav" >
                
                <li><Link to="/find-my-booking">find my Booking</Link></li>
                <li><Link to="/WeddingHalls">wedding hall</Link></li>
                <li><Link to="/community">community</Link></li>
                <li><Link to="/event">JoyNest Chat</Link></li>
                {isLoggedIn ? (
  <>
    <li style={{ marginLeft: '16px' , marginBottom: '0', marginTop: '0' }}>
  <button
    onClick={() => setShowCartSidebar(true)}
    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    title="Cart"
  >
    <i className="fa fa-shopping-cart" style={{ color: 'white', fontSize: '20px' }} />
  </button>
</li>
<li style={{ marginLeft: '22px', marginBottom: 0, marginTop: 0, position: 'relative' }}>
  <button
    onClick={() => setShowNotification(true)}
    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    title="Notifications"
  >
    <i className="fa fa-bell" style={{ color: 'white', fontSize: '19px' }} />
    {notifications.length > 0 && (
      <span
        style={{
          position: 'absolute',
          top: '-1px',
          right: '-1px',
          width: '8px',
          height: '8px',
          backgroundColor: 'red',
          borderRadius: '50%'
        }}
      ></span>
    )}
  </button>
  {showNotification && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '250px',
          height: '100%',
          background: 'linear-gradient(to right, #66cef6, #f666b1)',
          boxShadow: '-4px 0 10px rgba(0,0,0,0.3)',
          zIndex: 9999,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          color: '#fff'
        }}
      >
        <button
          onClick={() => setShowNotification(false)}
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h3 style={{ marginBottom: '15px' }}>Notifications</h3>

        {notifications.length === 0 ? (
          <p>no notifications for now.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              style={buttonStyle}
              onClick={() => {
                console.log(`booking details ID: ${notification.id}`);
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#787777ff" }}>
              Title : {notification.title}
            </span>
            <br/>
              
              Message : {notification.message}
              <br/>
             <span style={{ fontSize: "14px", fontWeight: "bold", color: "#787777ff" }}>
              {new Date(notification.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
            {/* Trash button */}
              <button
                onClick={async () => {
                  try {
                    await axios.delete(
                      `http://localhost:8081/api/notifications/${notification.id}`
                    );

                    // Update state (remove deleted notification)
                    setNotifications((prev) =>
                      prev.filter((n) => n.id !== notification.id)
                    );

                    toast.success("Notification deleted successfully!");
                  } catch (error) {
                    console.error("Error deleting notification:", error);
                    toast.error("Failed to delete notification.");
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ff4444",
                  fontSize: "16px",
                  marginLeft: "10px"
                }}
                title="Delete notification"
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>
    )}
</li>
    <li
      className="profile-menu"
      style={{ position: 'relative', marginLeft: '25px' }}
    >
      <div
        onClick={() => setShowDropdown(prev => !prev)}
        style={{ cursor: 'pointer', color: 'white', fontSize: '18px',marginTop : '0px' ,marginBottom : '0px'   }}
        title="Profile"
      >
        <i className="fa fa-user-circle" />
      </div>
      {showCartSidebar && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '350px',
      height: '100%',
      backgroundColor: '#fff',
      boxShadow: '-4px 0 10px rgba(0,0,0,0.3)',
      zIndex: 9999,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <button
      onClick={() => setShowCartSidebar(false)}
      style={{
        alignSelf: 'flex-end',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer'
      }}
      title="Close"
    >
      &times;
    </button>

    <h3 style={{ marginTop: '20px', textAlign: 'center' }}>Your Cart</h3>
    
    {cartItems.length === 0 ? (
      <p style={{ textAlign: 'center', marginTop: '20px' }}>Your cart is empty</p>
    ) : (
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
  
{cartItems.map((item, index) => (
  <div key={index} style={{
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '10px',
    borderBottom: '1px solid #eee',
    position: 'relative'
  }}>
    {item.images?.length > 0 ? (
      <img 
        src={item.images[0]} 
        alt={item.name}
        style={{
          width: '80px',
          height: '60px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginRight: '15px'
        }}
      />
    ) : (
      <div style={{
        width: '80px',
        height: '60px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginRight: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <i className="fa fa-image" style={{ color: '#ccc', fontSize: '24px' }} />
      </div>
    )}
    <div style={{ flex: 1 }}>
      <h4 style={{ margin: 0 }}>{item.name}</h4>
      
      <p style={{ margin: '5px 0' }}>
        
        {item.price && `$${item.price}`}
        {item.price_per_day && `$${item.price_per_day} per day`}
        {item.price_per_hour && ` | $${item.price_per_hour} per hour`}
      </p>
      {item.eventDate && (
        <p style={{ fontSize: '12px', color: '#666' }}>
          {new Date(item.eventDate).toLocaleDateString()} | {item.startTime?.split('T')[1]?.substring(0, 5)} - {item.endTime?.split('T')[1]?.substring(0, 5)}
        </p>
      )}
      {item.type && (
        <p style={{ fontSize: '12px', color: '#666' }}>Type: {item.type}</p>
      )}
    </div>
<button
  onClick={async () => {
    try {
      if (item.bookingId) {
        await axios.delete(`http://localhost:8081/api/bookings/${item.bookingId}`);
      }

      const updatedCart = cartItems.filter((_, i) => i !== index);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);

      toast.success('Item removed successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item. Please try again.');
    }
  }}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ff4444',
    fontSize: '18px',
    marginLeft: '10px'
  }}
  title="Remove item"
>
  <i className="fa fa-trash" />
</button>

  </div>
))}
      </div>
    )}

    {cartItems.length > 0 && (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
   
    <button
     
      style={{
        background: 'linear-gradient(to right, #66cef6, #f666b1)',
        color: 'white',
        padding: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginTop: '15px',
        marginBottom: '10px',
        width: '250px'
      }}
    >
      total Price (${calculateTotalPrice().toFixed(2)})
    </button>
    <div style={{ display: 'flex', gap: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
  <button
    onClick={() => navigate('/find-my-booking')}
    style={{
      background: 'linear-gradient(to right, #66cef6, #f666b1)',
      color: 'white',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer'
    }}
  >
    Go to Checkout
  </button>
</div>
    </div>
  </div>
)}
  </div>
)}
     {showDropdown && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '250px',
      height: '100%',
      background: 'linear-gradient(to right, #66cef6, #f666b1)',
      boxShadow: '-4px 0 10px rgba(0,0,0,0.3)',
      zIndex: 9999,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      color: '#fff'
    }}
  >


    <button
  onClick={() => setShowDropdown(false)}
  style={{
    alignSelf: 'flex-end',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#fff',
    cursor: 'pointer'
  }}
>
  &times;
</button>

        <h3 style={{ marginBottom: '30px' }}>My Account</h3>

    <button
      onClick={() => {
        navigate('/payment-history');
        setShowDropdown(false);
      }}
      style={buttonStyle}
    >
      <i className="fa fa-credit-card" style={{ marginRight: '8px' }}></i>
      Payment History
    </button>

    <button
      onClick={() => {
        navigate('/edit-profile');
        setShowDropdown(false);
      }}
      style={buttonStyle}
    >
      <i className="fa fa-pencil" style={{ marginRight: '8px' }}></i>
      Edit My Profile
    </button>

    <button
  onClick={() => {
    handleLogout();
    setShowDropdown(false);
  }}
  style={{ ...buttonStyle, background: '#fff', color: '#d00' }}
>
  <i className="fa fa-sign-out" style={{ marginRight: '8px' }}></i>
  Logout
</button>
  </div>
)}
    </li>
  </>
) : (
  <li><Link to="/sign-up">Login/SignUp</Link></li>
)}
              </ul>
            </nav>
          </div>
        </header>
        <div id="first-slider">
          <div
            id="carousel-example-generic"
            className="carousel slide carousel-fade"
          >
            <ol className="carousel-indicators">
              <li
                data-target="#carousel-example-generic"
                data-slide-to={0}
                className="active"
              />
              <li data-target="#carousel-example-generic" data-slide-to={1} />
              <li data-target="#carousel-example-generic" data-slide-to={2} />
              <li data-target="#carousel-example-generic" data-slide-to={3} />
            </ol>
            <div className="carousel-inner" role="listbox">
              <div className="item active slide1">
                <div className="row">
                  <div className="container">
                    <div className="col-md-9 text-left">
                      <h3 data-animation="animated bounceInDown">
                        Elean &amp; Jake
                      </h3>
                      <h4 data-animation="animated bounceInUp">
                        This isn't just a wedding. It's the beginning of a timeless bond — where love leads, hearts follow, and every breath we take becomes a vow to never walk alone.
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              {/* Item 2 */}
              <div className="item slide2">
                <div className="row">
                  <div className="container">
                    <div className="col-md-7 text-left">
                      <h3 data-animation="animated bounceInDown">
                        Our Wedding Day
                      </h3>
                      <h4 data-animation="animated bounceInUp">
                      Love brought them together, and now they walk hand in hand toward a future built on dreams, trust, and a thousand quiet moments of understanding.
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              {/* Item 3 */}
              <div className="item slide3">
                <div className="row">
                  <div className="container">
                    <div className="col-md-7 text-left">
                      <h3 data-animation="animated bounceInDown">Join With Us</h3>
                      <h4 data-animation="animated bounceInUp">
                        Every love story is beautiful, but ours is our favorite — a journey of two hearts becoming one, written with laughter, tears, and a promise of forever.
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <a
              className="left carousel-control"
              href="#carousel-example-generic"
              role="button"
              data-slide="prev"
            >
              <i className="fa fa-angle-left" />
              <span className="sr-only">Previous</span>
            </a>
            <a
              className="right carousel-control"
              href="#carousel-example-generic"
              role="button"
              data-slide="next"
            >
              <i className="fa fa-angle-right" />
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </section>
      <section id="services" className="services service-section">
        <div className="container">
          <div className="section-header">
            <h2 className="wow fadeInDown animated">Events &amp; Parties</h2>
            <p className="wow fadeInDown animated">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget
              risus vitae massa <br /> semper aliquam quis mattis quam.
            </p>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-6 services text-center">
              {" "}
              <span className="icon icon-heart" />
              <div className="services-content">
                <h5>Wedding Ceremony</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu
                  libero scelerisque ligula sagittis faucibus eget quis lacus.
                </p>
                <p>
                  Hotel Mariline, NY
                  <br />
                  Friday, 22 Aug 2017
                  <br />
                  4:30PM - 6:15PM
                </p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 services text-center">
              {" "}
              <span className="icon icon-ribbon" />
              <div className="services-content">
                <h5>Wedding Party</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu
                  libero scelerisque ligula sagittis faucibus eget quis lacus.
                </p>
                <p>
                  Hotel Mariline, NY
                  <br />
                  Thursday, 26 Aug 2017
                  <br />
                  4:30PM - 6:15PM
                </p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 services text-center">
              {" "}
              <span className="icon icon-gift" />
              <div className="services-content">
                <h5>Dinner</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu
                  libero scelerisque ligula sagittis faucibus eget quis lacus.
                </p>
                <p>
                  Hotel Mariline, NY
                  <br />
                  Friday, 30 Aug 2017
                  <br />
                  4:30PM - 6:15PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="content-3-10"
        className="content-block data-section nopad content-3-10"
      >
        <div className="image-container col-sm-6 col-xs-12 pull-left">
          <div className="background-image-holder"></div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6 col-sm-offset-6 col-xs-12 content">
              <div>
                <h3>Our Signature Bouquets</h3>
              </div>
              <div>
                <p>
                 We create stunning floral arrangements to add elegance and beauty to your special events.
                From weddings and engagements to personal celebrations – we carefully select each flower to match your style.
                </p>
                <p>
                  Let us design something magical💐Browse our portfolio and get in touch for your custom bouquet!
                </p>
              </div>
              <Link
                to="/gallery"
                className="btn btn-outline btn-outline outline-dark"
              >
                Our Portfolio
              </Link>
            </div>
          </div>
        </div>
  
      </section>
      <section id="gallery" className="gallery section">
        <div className="container-fluid">
          <div className="section-header">
            <h2 className="wow fadeInDown animated">Gallery</h2>
            <p className="wow fadeInDown animated">
              Because every moment deserves to be remembered beautifully
            </p>
          </div>
          <div className="row no-gutter">
            <div className="col-lg-3 col-md-6 col-sm-6 work">
              {" "}
              <a href="images/portfolio/pexels-jeremy-wong-382920-1035665.jpg" className="work-box">
                {" "}
                <img src="images/portfolio/pexels-jeremy-wong-382920-1035665.jpg" alt="" />
                <div className="overlay">
                  <div className="overlay-caption">
                    <p>
                      <span className="icon icon-magnifying-glass" />
                    </p>
                  </div>
                </div>
                
              </a>{" "}
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 work">
              {" "}
              <a href="images/portfolio/pexels-edwardeyer-1045541 (2).jpg" className="work-box">
                {" "}
                <img src="images/portfolio/pexels-edwardeyer-1045541 (2).jpg" alt="" />
                <div className="overlay">
                  <div className="overlay-caption">
                    <p>
                      <span className="icon icon-magnifying-glass" />
                    </p>
                  </div>
                </div>
               
              </a>{" "}
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 work">
              {" "}
              <a href="images/portfolio/pexels-leah-newhouse-50725-540522.jpg" className="work-box">
                {" "}
                <img src="images/portfolio/pexels-leah-newhouse-50725-540522.jpg" alt="" />
                <div className="overlay">
                  <div className="overlay-caption">
                    <p>
                      <span className="icon icon-magnifying-glass" />
                    </p>
                  </div>
                </div>
               
              </a>{" "}
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 work">
              {" "}
              <a href="images/portfolio/pexels-pixabay-265920 (1).jpg" className="work-box">
                {" "}
                <img src="images/portfolio/pexels-pixabay-265920 (1).jpg" alt="" />
                <div className="overlay">
                  <div className="overlay-caption">
                    <p>
                      <span className="icon icon-magnifying-glass" />
                    </p>
                  </div>
                </div>
           
              </a>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 work">
             
              <a href="images/portfolio/pexels-tae-fuller-331517-1616113 (1).jpg" className="work-box">
                
                <img src="images/portfolio/pexels-tae-fuller-331517-1616113 (1).jpg" alt="" />
                <div className="overlay">
                  <div className="overlay-caption">
                    <p>
                      <span className="icon icon-magnifying-glass" />
                    </p>
                  </div>
                </div>
                
              </a>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 work">
             
              <a href="images/portfolio/pexels-goumbik-574011.jpg" className="work-box">
             
                <img src="images/portfolio/pexels-goumbik-574011.jpg" alt="" />
                <div className="overlay">
                  <div className="overlay-caption">
                    <p>
                      <span className="icon icon-magnifying-glass" />
                    </p>
                  </div>
                </div>
               
              </a>{" "}
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 work">
            
              <a href="images/portfolio/pexels-asadphoto-169198 (1).jpg" className="work-box">
               
                <img src="images/portfolio/pexels-asadphoto-169198 (1).jpg" alt="" />
                <div className="overlay">
                  <div className="overlay-caption">
                    <p>
                      <span className="icon icon-magnifying-glass" />
                    </p>
                  </div>
                </div>
             
              </a>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 work">
              {" "}
              <a href="images/portfolio/pexels-asadphoto-169190 (1).jpg" className="work-box">
                {" "}
                <img src="images/portfolio/pexels-asadphoto-169190 (1).jpg" alt="" />
                <div className="overlay">
                  <div className="overlay-caption">
                    <p>
                      <span className="icon icon-magnifying-glass" />
                    </p>
                  </div>
                </div>
              
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="teams" className="section teams">
        <div className="container">
          <div className="section-header">
            <h2 className="wow fadeInDown animated">Our Event Virtuosos</h2>
            <p className="wow fadeInDown animated">
              "Our trusted team of wedding specialists brings your vision to life with precision and creativity. Every detail is crafted to perfection."
            </p>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-6">
              <div className="person">
                <img src="images/team-1.jpg" alt="" className="img-responsive" />
                <div className="person-content">
                  <h4>Jonh Dow</h4>
                  <p>
                    Master floral designer transforming spaces into breathtaking botanical wonderlands.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="person">
                {" "}
                <img src="images/team-2.jpg" alt="" className="img-responsive" />
                <div className="person-content">
                  <h4>Markus Linn</h4>
                  <p>
                    Lighting and sound virtuoso - sculpting immersive atmospheres that captivate.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="person">
                {" "}
                <img src="images/team-3.jpg" alt="" className="img-responsive" />
                <div className="person-content">
                  <h4>Chris Jemes</h4>
                  <p>
                   Event choreographer ensuring seamless flow from ceremony to last dance.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="person">
                {" "}
                <img src="images/team-4.jpg" alt="" className="img-responsive" />
                <div className="person-content">
                  <h4>Vintes Mars</h4>
                  <p>
                    Award-winning decor architect blending luxury with personalized storytelling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="testimonials" className="section testimonials no-padding">
        <div className="container-fluid">
          <div className="row no-gutter">
            <div className="flexslider">
              <ul className="slides">
                <li>
                  <div className="col-md-12">
                    <blockquote>
                      <p>
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Praesent eget risus vitae massa semper aliquam quis mattis
                        consectetur adipiscing elit.."{" "}
                      </p>
                      <p>Chris Mentsl</p>
                    </blockquote>
                  </div>
                </li>
                <li>
                  <div className="col-md-12">
                    <blockquote>
                      <p>
                        "Praesent eget risus vitae massa Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Praesent eget risus vitae massa
                        semper aliquam quis mattis consectetur adipiscing elit.."{" "}
                      </p>
                      <p>Kristean velnly</p>
                    </blockquote>
                  </div>
                </li>
                <li>
                  <div className="col-md-12">
                    <blockquote>
                      <p>
                        "Consectetur adipiscing elit Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Praesent eget risus vitae massa
                        semper aliquam quis mattis consectetur adipiscing elit.."{" "}
                      </p>
                      <p>Markus Denny</p>
                    </blockquote>
                  </div>
                </li>
                <li>
                  <div className="col-md-12">
                    <blockquote>
                      <p>
                        "Vitae massa semper aliquam Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Praesent eget risus vitae massa
                        semper aliquam quis mattis consectetur adipiscing elit.."{" "}
                      </p>
                      <p>John Doe</p>
                    </blockquote>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="wow fadeInDown animated">Contact Us</h2>
            <p className="wow fadeInDown animated">
              "Schedule your free consultation today and begin crafting the wedding of your dreams!"
              <br />
            </p>
          </div>
          <div className="row">
            <div className="col-md-8 col-md-offset-2 conForm">
              <div id="message" />
             <form onSubmit={handleContactSubmit} name="cform" id="cform">
  <input
    name="email"
    id="email"
    type="email"
    value={contact.email}
    onChange={handleContactChange}
    className="col-xs-12 col-sm-12 col-md-12 col-lg-12 noMarr"
    placeholder="Email Address..."
    required
  />
  <input
    name="title"
    id="title"
    type="text"
    value={contact.title}
    onChange={handleContactChange}
    className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
    placeholder="Title For Your Message..."
    required
  />
  <textarea
    name="message"
    id="message"
    value={contact.message}
    onChange={handleContactChange}
    className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
    placeholder="Message..."
    required
  />
  <input
    type="submit"
    id="submit"
    className="submitBnt"
    value="Send"
  />
</form>

              
            </div>
          </div>
        </div>
      </section>
      {/* Footer section */}
      <footer className="footer section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-sm-6 footer-col">
              <h5>About Us</h5>
              <p>JoyNest is dedicated to creating unforgettable events, from dream weddings to elegant parties. Our experienced team ensures every detail is perfect, allowing you to celebrate without a worry.</p>
            </div>
            <div className="col-md-4 col-sm-6 footer-col">
              <h5>Quick Links</h5>
              <ul className="list-default">
                <li><Link to="/find-my-booking">Find My Booking</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/review">Review</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/sign-up">Login/SignUp</Link></li>
              </ul>
            </div>
            <div className="col-md-4 col-sm-6 footer-col">
              <h5>Contact Info</h5>
              <address>
                <p>123 Event Street, City, Country</p>
                <p>Email: info@joynest.com</p>
                <p>Phone: +1 (123) 456-7890</p>
              </address>
              <ul className="footer-share">
                <li><a href="#" aria-label="Facebook"><i className="fa fa-facebook" /></a></li>
                <li><a href="#" aria-label="Twitter"><i className="fa fa-twitter" /></a></li>
                <li><a href="#" aria-label="LinkedIn"><i className="fa fa-linkedin" /></a></li>
                <li><a href="#" aria-label="Instagram"><i className="fa fa-instagram" /></a></li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <p className="copy-right">© 2025 JoyNest. All Rights Reserved. Designed by WebThemez</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Header;