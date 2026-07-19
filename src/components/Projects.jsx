import Skills from './Skills';

function Projects({ skillsData }) {
  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>My Projects & Skills</h2>
      <Skills skills={skillsData} />
    </div>
  );
}

export default Projects;
