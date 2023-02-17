import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import "./NavbarField.css";
import univname from '.././UAlbanymark-wordsonly.png';
import unilogo from '.././minerva-mark.png';

function NavbarField() {
  return (
    <>

      <Navbar bg="" variant="dark" className="mainnavbar">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src= {unilogo}
              className="d-inline-block align-top"
            />{' '}
            <img
              alt=""
              src= {univname}
              className="d-inline-block align-top"
            />{' '}
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarField;