/*global chrome*/
import React from "react";
import ReactDOM from "react-dom";
import Frame, { FrameContextConsumer } from "react-frame-component";
import styles from "./content.css";
import { Menu, Icon } from "antd";
import Links from "./utils/links";

function Content() {
  const state = {
    current: "mail"
  };

  const handleClick = e => {
    console.log("click ", e);
    this.setState({
      current: e.key
    });
  };

  return (
    /**
     * head: array of <link> will be imported to iframe
     */
    <Frame head={Links}>
      <FrameContextConsumer>
        {/**
         * Callback is invoked with iframe's window and document instances
         */
        ({ document, window }) => {
          /**
           * Render Children
           */
          return (
            <div className={styles.myApp}>
              <Menu
                onClick={handleClick}
                selectedKeys={[state.current]}
                mode="horizontal"
              >
                <Menu.Item key="mail">
                  <Icon type="inbox" />
                  Inbox
                </Menu.Item>
                <Menu.Item key="contact">
                  <Icon type="team" />
                  Contacts
                </Menu.Item>
                <Menu.Item key="setting">
                  <Icon type="setting" />
                  Settings
                </Menu.Item>
              </Menu>
            </div>
          );
        }}
      </FrameContextConsumer>
    </Frame>
  );
}

/**
 * append the element that will be used in the extension
 */
const app = document.createElement("div");
app.id = "my-app-root";
document.body.appendChild(app);

/**
 * hide the extension in the brower
 */
app.style.display = "none";

/**
 * receive message on browser action clicked
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    toggle();
  }
});

/**
 * toogle extension in browser
 */
function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}

/**
 * render the app
 */
ReactDOM.render(<Content />, app);
