import React, { Component } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000", { transports: ['websocket'] });

class App extends Component {
  constructor() {
    super();
    this.state = { msg: "", chat: [] };
  }

  componentDidMount() {
    socket.on("chat message", ({ msg }) => {
      this.setState({
        chat: [...this.state.chat, { msg }]
      });
    });
  }

  onTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onMessageSubmit = () => {
    const { msg } = this.state;
    socket.emit("chat message", { msg });
    this.setState({ msg: "" });
  };

  renderChat() {
    const { chat } = this.state;
    return chat.map(({ msg }, idx) => (
      <div key={idx}>
        <span>{msg}</span>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <span>Message</span>
        <input
          name="msg"
          onChange={e => this.onTextChange(e)}
          value={this.state.msg}
        />
        <button onClick={this.onMessageSubmit}>Send</button>
        <div>{this.renderChat()}</div>
      </div>
    );
  }
}

export default App;