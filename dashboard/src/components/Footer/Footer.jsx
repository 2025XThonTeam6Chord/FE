import { Container, Row } from "reactstrap";

function Footer({ default: defaultFooter = false, fluid = false }) {
  return (
    <footer className={`footer${defaultFooter ? " footer-default" : ""}`}>
      <Container fluid={fluid}>
        <Row>
          <nav className="footer-nav">
            <ul>
              <li>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  넌 잘못이 없어
                </a>
              </li>
            </ul>
          </nav>
          <div className="credits ml-auto">
            <div className="copyright">
              &copy; {1900 + new Date().getYear()}, made with{" "}
              <i className="fa fa-heart heart" /> by 내가 뭘 잘못했지 팀
            </div>
          </div>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
