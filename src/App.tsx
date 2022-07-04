import React from "react";
import { Footer } from "antd/lib/layout/layout";
import Uploader from "./Components/Uploader";
import { appStyles } from "./styles.constant";

function App() {
  return (
    <div style={appStyles}>
      <Uploader />
      <Footer>
        Made with ❤️ by{" "}
        <a href="https://github.com/Sachin-chaurasiya" target="_blank">
          @Sachin-chaurasiya
        </a>
      </Footer>
    </div>
  );
}

export default App;
