import Header from './Header';
import About from './About';
import Skills from './Skills';
import Footer from './Footer';

function Home({ studentName, studentId, studentTitle, contactEmail, socialLinksData, skillsData }) {
  return (
    <div>
      <Header name={studentName} studentId={studentId} title={studentTitle} />
      <About />
      {skillsData && <Skills skills={skillsData} />}
      <Footer email={contactEmail} socialLinks={socialLinksData} />
    </div>
  );
}

export default Home;
