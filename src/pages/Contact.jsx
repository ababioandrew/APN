import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import { IconPhone, IconMail, IconMapPin } from '../components/Icons';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const [headingRef, headingVisible] = useInView({
    threshold: 0.2,
  });

  const [infoRef, infoVisible] = useInView({
    threshold: 0.15,
  });

  const [formRef, formVisible] = useInView({
    threshold: 0.15,
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="contact-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <PageHeader
        label="Get In Touch"
        title="We Would Love To Hear From You"
        subtitle="Have a question, need prayer, or planning to visit? Get in touch with us. We would be happy to connect with you."
        bg="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=85"
      />


      {/* =====================================
          CONTACT BAND
      ====================================== */}

      <div className="contact-band">

        <div className="contact-band-inner">

          <div className="contact-band-item">

            <span className="band-icon">
              <IconPhone size={14} />
            </span>

            <span>
              (+233)207464426 / 541215212 
            </span>
          </div>

          <div className="contact-band-item">

            <span className="band-icon">
              <IconMail size={14} />
            </span>

            <span>
              Answeredprayernetwork@gmail.com
            </span>

          </div>

        </div>

      </div>


      {/* =====================================
          MAIN CONTACT SECTION
      ====================================== */}

      <section className="contact-main">

        <div className="contact-main-inner">

          {/* HEADING */}

          <div
            className={`contact-heading anim-fade-up ${
              headingVisible ? 'visible' : ''
            }`}
            ref={headingRef}
          >

            <p
              className="section-eyebrow"
              style={{ textAlign: 'center' }}
            >
              Connect With Us
            </p>

            <h2
              className="section-title"
              style={{ textAlign: 'center' }}
            >
              We Are Here For You
            </h2>

            <span className="gold-rule centered"></span>

            <p className="contact-intro">
              Whether you are looking for a church family,
              need someone to pray with you, or simply have
              a question, please reach out. We would love to
              hear from you and welcome you into our church
              community.
            </p>

          </div>


          {/* =================================
              CONTACT GRID
          ================================= */}

          <div className="contact-grid">

            {/* =================================
                LEFT — CHURCH INFORMATION
            ================================= */}

            <div
              className={`contact-info anim-slide-left ${
                infoVisible ? 'visible' : ''
              }`}
              ref={infoRef}
            >

              {/* ADDRESS */}

              <div className="contact-info-item">

                <div className="ci-icon">
                  <IconMapPin size={18} />
                </div>

                <div>

                  <p className="ci-label">
                    Church Location
                  </p>

                  <p className="ci-value">
                    No. 5 Bert Mensah Street,
                    <br />
                    Mataheko, Tema
                    <br />
                    Ghana
                  </p>

                </div>

              </div>


              {/* PHONE */}

              <div className="contact-info-item">

                <div className="ci-icon">
                  <IconPhone size={18} />
                </div>

                <div>

                  <p className="ci-label">
                    Phone
                  </p>

                  <p className="ci-value">
                    (+233) 59 345 4867
                  </p>

                </div>

              </div>


              {/* EMAIL */}

              <div className="contact-info-item">

                <div className="ci-icon">
                  <IconMail size={18} />
                </div>

                <div>

                  <p className="ci-label">
                    Email
                  </p>

                  <p className="ci-value">
                    Answeredprayernetwork@gmail.com
                  </p>

                </div>

              </div>


              {/* SERVICE TIMES */}

              <div className="contact-service-times">

                <div className="service-times-icon">
                  ✝
                </div>

                <div>

                  <p className="ci-label">
                    Worship Services
                  </p>

                  <p className="ci-value">
                    Sunday Worship
                    <br />
                    8:00 AM &nbsp;–&nbsp; 11:00 AM
                  </p>

                  <p className="ci-value service-time-extra">
                    Midweek Service
                    <br />
                    Wednesday — 6:00 PM
                  </p>

                </div>

              </div>


              {/* MAP */}

              <div className="map-container">

                <iframe
                  title="Church Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31755.94!2d-0.0166!3d5.6698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2d34a3f%3A0xd3a6a6b4c5d36f0!2sTema%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1"
                  width="100%"
                  height="220"
                  style={{
                    border: 0,
                    display: 'block',
                  }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <a
                  href="https://goo.gl/maps/tema"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold map-btn"
                >
                  Get Directions
                </a>

              </div>

            </div>


            {/* =================================
                RIGHT — CONTACT FORM
            ================================= */}

            <div
              className={`contact-form-col anim-slide-right ${
                formVisible ? 'visible' : ''
              }`}
              ref={formRef}
            >

              {submitted ? (

                /* =================================
                   SUCCESS MESSAGE
                ================================= */

                <div className="form-success">

                  <div className="form-success-icon">
                    ✓
                  </div>

                  <h3>
                    Message Received
                  </h3>

                  <p>
                    Thank you for reaching out to us.
                    We have received your message and
                    someone from our church family will
                    get in touch with you shortly.
                  </p>

                  <button
                    className="btn-gold"
                    style={{ marginTop: 24 }}
                    onClick={() => {
                      setSubmitted(false);

                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        message: '',
                      });
                    }}
                  >
                    Send Another Message
                  </button>

                </div>

              ) : (

                /* =================================
                   CONTACT FORM
                ================================= */

                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                >

                  <div className="form-form-heading">

                    <p className="section-eyebrow">
                      Send Us A Message
                    </p>

                    <h3>
                      We'd Love To Connect With You
                    </h3>

                    <p>
                      Fill out the form below and a member
                      of our church team will get back to you.
                    </p>

                  </div>


                  {/* NAME */}

                  <div className="form-field">

                    <label htmlFor="name">
                      Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />

                  </div>


                  {/* EMAIL */}

                  <div className="form-field">

                    <label htmlFor="email">
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      required
                    />

                  </div>


                  {/* PHONE */}

                  <div className="form-field">

                    <label htmlFor="phone">
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                    />

                  </div>


                  {/* MESSAGE */}

                  <div className="form-field">

                    <label htmlFor="message">
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we pray for you or help you?"
                      required
                    />

                  </div>


                  <button
                    type="submit"
                    className="btn-gold form-submit"
                  >
                    Send Message
                  </button>

                </form>

              )}

            </div>

          </div>

        </div>

      </section>


      <Footer />

    </main>
  );
}