import Header from './Header';
import About from './About';
import Footer from './Footer';

function Home({ studentName, studentTitle, contactEmail, socialLinksData }) {
  return (
    <div>
      <Header name={studentName} title={studentTitle} />
      <About />
      <Footer email={contactEmail} socialLinks={socialLinksData} />
    </div>
  );
}

export default Home;
