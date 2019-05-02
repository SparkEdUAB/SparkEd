import React from "react";

function Landing() {
  return (
    <>
      <div className="img-container">
        <img src="/library2.jpg" alt="sparked logo" id="landing-image" />
        <div className="centered-text">
          <div className="section no-pad-bot" id="index-banner">
            <div className="container-fluid" style={{ marginBottom: "47%" }}>
              <h1 className="header center blue-text lighten-2">
                SparkEd Platform
              </h1>
              <div className="row center">
                <h5 className="header col s12 light">
                  A modern way of organizing Educational content
                </h5>
              </div>
              <div className="row center">
                <a
                  href={"/"}
                  id="download-button"
                  className="btn-large waves-effect waves-light blue darken-1"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="section">
          <div className="row">
            <div className="col s12 m4 ">
              <div className="icon-block">
                <h2 className="center light-blue-text">
                  <i className="fa fa-graduation-cap" />
                </h2>
                <h5 className="center">Educational Content Platform</h5>

                <p className="light">
                  Customize and Organize Educational contents
                </p>
              </div>
            </div>

            <div className="col s12 m4 ">
              <div className="icon-block">
                <h2 className="center light-blue-text">
                  <i className="fa fa-book" />
                </h2>
                <h5 className="center">Add Books and Read them</h5>

                <p className="light">
                  Ability to organize books and allow users to read according to
                  their courses
                </p>
              </div>
            </div>

            <div className="col s12 m4 ">
              <div className="icon-block ">
                <h2 className="center light-blue-text">
                  <i className="fa fa-video-camera" />
                </h2>
                <h5 className="center">Add videos and watch them</h5>

                <p className="light">Ability to upload course videos</p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
      </div>
    </>
  );
}
export default Landing;
