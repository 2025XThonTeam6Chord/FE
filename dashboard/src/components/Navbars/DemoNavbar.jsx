import { useState, useEffect, useRef, useCallback } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Container,
} from "reactstrap";

function DemoNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("transparent");
  const sidebarToggle = useRef(null);

  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };

  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    if (sidebarToggle.current) {
      sidebarToggle.current.classList.toggle("toggled");
    }
  };

  const updateColor = useCallback(() => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener("resize", updateColor);
    return () => {
      window.removeEventListener("resize", updateColor);
    };
  }, [updateColor]);

  useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      if (sidebarToggle.current) {
        sidebarToggle.current.classList.toggle("toggled");
      }
    }
  }, []);

  return (
    <Navbar
      color={color}
      expand="lg"
      className={`navbar-absolute fixed-top ${
        color === "transparent" ? "navbar-transparent" : ""
      }`}
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={openSidebar}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand href="/">대시보드</NavbarBrand>
        </div>
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse
          isOpen={isOpen}
          navbar
          className="justify-content-end"
        ></Collapse>
      </Container>
    </Navbar>
  );
}

export default DemoNavbar;
