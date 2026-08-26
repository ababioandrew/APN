
// Update code with Church name: Answered Prayer Network and icon: APNIcon

import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import APNIcon from '../icons/APN.png';

import {
  IconBalance,
  IconBuilding,
  IconDocument,
  IconCompliance,
  IconContract,
  IconDueDiligence,
} from '../components/Icons';
import { useInView } from '../hooks/useInView';
import './Services.css';

/*
|--------------------------------------------------------------------------
| CHURCH MINISTRIES
|--------------------------------------------------------------------------
*/

const ministries = [
  {
    icon: <IconBalance size={44} />,
    title: 'Sunday Worship',
    desc: 'Join us every Sunday for a powerful time of worship, biblical teaching, prayer, fellowship, and encouragement. Our services are designed to help you grow in your relationship with God and connect with the church family.',
    features: [
      'Worship & Praise',
      'Biblical Teaching',
      'Prayer',
      'Fellowship',
    ],
  },

  {
    icon: <IconBuilding size={44} />,
    title: 'Prayer Ministry',
    desc: 'Our prayer ministry is dedicated to standing with individuals, families, and the church in prayer. Whether you are trusting God for direction, healing, breakthrough, or strength, we believe in the power of prayer.',
    features: [
      'Prayer Meetings',
      'Prayer Requests',
      'Intercession',
      'Spiritual Support',
    ],
  },

  {
    icon: <IconDocument size={44} />,
    title: 'Bible Study',
    desc: 'Grow deeper in your understanding of God’s Word through engaging Bible studies and discussions. Our Bible study sessions provide an opportunity to learn, ask questions, and apply biblical principles to everyday life.',
    features: [
      'Bible Teaching',
      'Group Discussions',
      'Scripture Study',
      'Spiritual Growth',
    ],
  },

  {
    icon: <IconCompliance size={44} />,
    title: 'Youth Ministry',
    desc: 'Our youth ministry creates a welcoming environment where young people can discover their identity in Christ, develop their gifts, build meaningful friendships, and grow in faith.',
    features: [
      'Youth Fellowship',
      'Bible Study',
      'Mentorship',
      'Youth Events',
    ],
  },

  {
    icon: <IconContract size={44} />,
    title: 'Children’s Ministry',
    desc: 'We provide a safe, joyful, and engaging environment where children can learn about God, develop strong biblical foundations, and experience the love of Christ through age-appropriate teaching and activities.',
    features: [
      'Children’s Church',
      'Bible Lessons',
      'Fun Activities',
      'Christian Values',
    ],
  },

  {
    icon: <IconDueDiligence size={44} />,
    title: 'Community Outreach',
    desc: 'We believe the church is called to serve beyond its walls. Through outreach and community initiatives, we seek to demonstrate God’s love by supporting individuals, families, and communities in practical ways.',
    features: [
      'Community Support',
      'Evangelism',
      'Charity Initiatives',
      'Mission Activities',
    ],
  },
];


/*
|--------------------------------------------------------------------------
| MINISTRY ROW
|--------------------------------------------------------------------------
*/

function MinistryRow({ ministry, index }) {
  const [ref, isVisible] = useInView({
    threshold: 0.12,
  });

  const isAlt = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`
        ministry-row
        ${isAlt ? 'ministry-row--alt' : ''}
        anim-fade-up
        ${isVisible ? 'visible' : ''}
      `}
      style={{
        animationDelay: '0.05s',
      }}
    >

      {/* ICON */}

      <div className="ministry-row-icon">
        {ministry.icon}
      </div>


      {/* CONTENT */}

      <div className="ministry-row-content">

        <h3 className="ministry-row-title">
          {ministry.title}
        </h3>

        <span
          className="gold-rule"
          style={{
            marginBottom: 16,
          }}
        ></span>

        <p className="ministry-row-desc">
          {ministry.desc}
        </p>


        {/* FEATURES */}

        <ul className="ministry-features">

          {ministry.features.map((feature) => (
            <li key={feature}>

              <span className="feature-dot"></span>

              {feature}

            </li>
          ))}

        </ul>

      </div>


      {/* CTA */}

      <div className="ministry-row-cta">

        <Link
          to="/contact"
          className="btn-outline-gold"
        >
          Get Involved
        </Link>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| SERVICES / MINISTRIES PAGE
|--------------------------------------------------------------------------
*/

export default function Services() {

  const [introRef, introVisible] = useInView({
    threshold: 0.2,
  });

  const [processRef, processVisible] = useInView({
    threshold: 0.1,
  });

  const [ctaRef, ctaVisible] = useInView({
    threshold: 0.2,
  });


  return (
    <main className="services-page">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeader
        label="Our Ministries"
        title="Serving God & Our Community"
        subtitle="Discover the ministries, services, and opportunities available to help you grow in faith and connect with our church family."
        bg="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=85"
      />


      {/* =====================================================
          INTRO
      ====================================================== */}

      <section className="services-intro">

        <div
          className={`
            services-intro-inner
            anim-fade-up
            ${introVisible ? 'visible' : ''}
          `}
          ref={introRef}
        >

          <p
            className="section-eyebrow"
            style={{
              textAlign: 'center',
            }}
          >
            Grow • Serve • Connect
          </p>


          <h2
            className="section-title"
            style={{
              textAlign: 'center',
            }}
          >
            Find Your Place in Our Church Family
          </h2>


          <span className="gold-rule centered"></span>


          <p className="services-intro-text">
            Our church provides different ministries and
            opportunities designed to help people grow
            spiritually, build meaningful relationships,
            discover their gifts, and serve God and others.
            There is a place for everyone.
          </p>

        </div>

      </section>


      {/* =====================================================
          MINISTRIES
      ====================================================== */}

      <section className="services-list">

        <div className="services-list-inner">

          {ministries.map((ministry, index) => (

            <MinistryRow
              key={ministry.title}
              ministry={ministry}
              index={index}
            />

          ))}

        </div>

      </section>


      {/* =====================================================
          HOW WE HELP PEOPLE GROW
      ====================================================== */}

      <section className="process-section">

        <div className="process-inner">

          {/* HEADER */}

          <div
            className={`
              anim-fade-up
              ${processVisible ? 'visible' : ''}
            `}
            ref={processRef}
          >

            <p
              className="section-eyebrow"
              style={{
                textAlign: 'center',
                color: 'var(--gold)',
              }}
            >
              Your Journey
            </p>


            <h2
              className="section-title"
              style={{
                textAlign: 'center',
                color: 'var(--white)',
              }}
            >
              Grow With Us
            </h2>


            <span className="gold-rule centered"></span>

          </div>


          {/* STEPS */}

          <div className="process-steps">

            {[
              {
                step: '01',
                title: 'Come As You Are',
                desc: 'Everyone is welcome. Join us for worship and experience a warm, friendly church community.',
              },

              {
                step: '02',
                title: 'Connect',
                desc: 'Meet other members, join a small group, and discover opportunities to build meaningful relationships.',
              },

              {
                step: '03',
                title: 'Grow',
                desc: 'Develop your faith through biblical teaching, prayer, worship, discipleship, and fellowship.',
              },

              {
                step: '04',
                title: 'Serve',
                desc: 'Discover your gifts and use them to serve God, the church, and the wider community.',
              },
            ].map((step, index) => (

              <div
                className={`
                  process-step
                  anim-fade-up
                  delay-${index + 1}
                  ${processVisible ? 'visible' : ''}
                `}
                key={step.step}
              >

                <div className="process-step-number">
                  {step.step}
                </div>


                <h3 className="process-step-title">
                  {step.title}
                </h3>


                <p className="process-step-desc">
                  {step.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="services-cta-section">

        <div
          className={`
            anim-fade-up
            ${ctaVisible ? 'visible' : ''}
          `}
          ref={ctaRef}
          style={{
            textAlign: 'center',
          }}
        >

          <p
            className="section-eyebrow"
            style={{
              textAlign: 'center',
            }}
          >
            We Would Love To Have You
          </p>


          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 28,
              color: 'var(--navy)',
              textAlign: 'center',
              margin: '8px 0 16px',
            }}
          >
            Find Your Place With Us
          </h2>


          <span
            className="gold-rule centered"
            style={{
              marginBottom: 20,
            }}
          ></span>


          <p
            style={{
              color: 'var(--gray)',
              maxWidth: 520,
              margin: '0 auto 32px',
              fontSize: 15,
              lineHeight: 1.8,
            }}
          >
            Whether you are visiting for the first time,
            looking for a church family, or ready to serve,
            we would love to connect with you.
          </p>


          <Link
            to="/contact"
            className="btn-gold"
          >
            Plan Your Visit
          </Link>

        </div>

      </section>


      <Footer />

    </main>
  );
}