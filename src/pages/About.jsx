import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import { useInView } from '../hooks/useInView';
import './About.css';

// ✅ Import APN logo
import APNIcon from '../icons/APN.png';

const ministries = [
  {
    icon: APNIcon,
    title: 'Worship',
    desc: 'We gather together to worship God through praise, prayer, fellowship, and the teaching of His Word.',
  },
  {
    icon: APNIcon,
    title: 'Prayer',
    desc: 'We believe in the power of prayer and encourage one another to seek God in every season of life.',
  },
  {
    icon: APNIcon,
    title: 'Discipleship',
    desc: 'We help believers grow deeper in their relationship with Christ and develop a life rooted in faith.',
  },
];

const values = [
  {
    title: 'Faith',
    desc: 'We trust God, believe His Word, and seek to follow His purpose for our lives.',
  },
  {
    title: 'Love',
    desc: 'We strive to love God and love people with compassion, grace, kindness, and humility.',
  },
  {
    title: 'Service',
    desc: 'We use our gifts and resources to serve God, His church, and our community.',
  },
  {
    title: 'Unity',
    desc: 'We believe the church is one family, growing together and supporting one another in Christ.',
  },
];

export default function About() {
  const [textRef, textVisible] = useInView({ threshold: 0.15 });
  const [imgRef, imgVisible] = useInView({ threshold: 0.15 });
  const [ministriesRef, ministriesVisible] = useInView({ threshold: 0.1 });
  const [valuesRef, valuesVisible] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaVisible] = useInView({ threshold: 0.2 });

  return (
    <main className="about-page">

      {/* =================================
          PAGE HEADER
      ================================== */}
      <PageHeader
        label="About Us"
        title="Answered Prayer Network — Built On Faith, Love & Community"
        subtitle="We are a community of believers committed to knowing Christ, growing together, serving others, and sharing the hope of the Gospel."
        bg="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=85"
      />

      {/* =================================
          CHURCH BRAND BAND
      ================================== */}
      <div className="about-nav-band">
        <div className="about-nav-inner">
          <span>FAITH • HOPE • LOVE</span>
        </div>
      </div>

      {/* =================================
          WHO WE ARE
      ================================== */}
      <section className="about-main">
        <div className="about-main-inner">
          <div
            className={`about-text anim-slide-left ${textVisible ? 'visible' : ''}`}
            ref={textRef}
          >
            <p className="section-eyebrow">Who We Are</p>
            <h2 className="section-title">
              A Family In Christ
              <br />
              Growing Together
            </h2>
            <span className="gold-rule" />
            <p className="about-para">
              Answered Prayer Network is a Christ-centered church community
              committed to helping people discover the love of God and grow in
              their relationship with Jesus Christ.
            </p>
            <p className="about-para">
              Our church is a place where people from different backgrounds can
              come together to worship, pray, learn from God's Word, build
              meaningful relationships, and serve others.
            </p>
            <p className="about-para">
              Whether you are new to faith, returning to church, or looking for
              a church family where you can grow, we welcome you. Our desire is
              to create a Christ-centered environment where everyone can feel
              welcomed, encouraged, and valued.
            </p>
          </div>

          <div
            className={`about-image-col anim-slide-right ${imgVisible ? 'visible' : ''}`}
            ref={imgRef}
          >
            <img
              src="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=900&q=85"
              alt="Church community gathered together"
              className="about-img"
            />
          </div>
        </div>
      </section>

      {/* =================================
          OUR MINISTRIES
      ================================== */}
      <section className="about-services">
        <div className="about-services-inner" ref={ministriesRef}>
          {ministries.map((ministry, index) => (
            <div
              className={`about-service-col anim-fade-up delay-${index + 1} ${ministriesVisible ? 'visible' : ''}`}
              key={ministry.title}
            >
              <div className="about-service-icon">
                <img src={ministry.icon} alt={`${ministry.title} icon`} className="service-icon" />
              </div>
              <h3 className="about-service-title">{ministry.title}</h3>
              <p className="about-service-desc">{ministry.desc}</p>
            </div>
          ))}
        </div>

        <div className="about-services-cta">
          <Link to="/services" className="btn-gold">Explore Our Ministries</Link>
        </div>
      </section>

      {/* =================================
          CORE VALUES
      ================================== */}
      <section className="values-section">
        <div className="values-inner">
          <div
            className={`values-header anim-fade-up ${valuesVisible ? 'visible' : ''}`}
            ref={valuesRef}
          >
            <p className="section-eyebrow" style={{ textAlign: 'center' }}>What We Believe</p>
            <h2 className="section-title" style={{ textAlign: 'center', color: 'var(--white)' }}>
              Our Core Values
            </h2>
            <span className="gold-rule centered" />
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div
                className={`value-card anim-fade-up delay-${index + 1} ${valuesVisible ? 'visible' : ''}`}
                key={value.title}
              >
                <div className="value-number">0{index + 1}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-desc">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================
          OUR VISION
      ================================== */}
      <section className="about-vision">
        <div className="about-vision-inner">
          <div className="vision-cross">✝</div>
          <p className="section-eyebrow">Our Vision</p>
          <h2 className="vision-title">
            Knowing Christ.
            <br />
            Growing Together.
            <br />
            Serving Others.
          </h2>
          <span className="gold-rule centered" />
          <p className="vision-desc">
            At Answered Prayer Network, we desire to see lives transformed by the Gospel,
            families strengthened through faith, and our community impacted by the love of Christ.
          </p>
        </div>
      </section>

      {/* =================================
          CTA
      ================================== */}
      <section className="about-cta">
        <div
          className={`about-cta-inner anim-fade-up ${ctaVisible ? 'visible' : ''}`}
          ref={ctaRef}
        >
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>You Are Welcome</p>
          <h2 className="about-cta-title">Come Worship With Answered Prayer Network</h2>
          <span className="gold-rule centered" />
          <p className="about-cta-desc">
            We would love to welcome you and your family.
            Come as you are, meet our church family, and grow together in faith.
          </p>
          <div className="about-cta-buttons">
            <Link to="/contact" className="btn-gold">Plan Your Visit</Link>
            <Link to="/services" className="btn-outline-gold">Explore Ministries</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
