const Footer = () => {
    return (
        <footer className="content-footer footer bg-footer-theme">
            <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
              <div className="mb-2 mb-md-0">
                ©
                  {(new Date().getFullYear())}
                , CLUV360 V4.0
              </div>
              <div className="d-none d-lg-inline-block">
                <a aria-label="go to themeselection for More Themes" href="https://themeselection.com/" target="_blank" rel='noreferrer' className="footer-link me-4">More Themes</a>

                <a aria-label="go to themeselection Documentation" href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/"
                  target="_blank" rel='noreferrer' className="footer-link me-4">Documentation</a>
              </div>
            </div>
          </footer>
      );
}
export default Footer;