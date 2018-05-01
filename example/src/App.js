import React, { PureComponent } from "react"

import StorageContext, { withStorageContext, Consumer } from "react-storage-context"

const DisplayLocalStorage = withStorageContext(({ local }) => (
  <div>Local storage values{JSON.stringify(local, undefined, 4)}</div>
))
class Buttons extends PureComponent {
  static getDerivedStateFromProps({ local: { localStorageCount }, session: { sessionStorageCount } }) {
    return {
      localStorageCount,
      sessionStorageCount
    }
  }

  render() {
    const { saveLocal, saveSession } = this.props
    return (
      <div>
        <button onClick={() => saveLocal({ localStorageCount: this.state.localStorageCount + 1 })}>
          Set local storage
        </button>
        <br />
        <button onClick={() => saveSession({ sessionStorageCount: this.state.sessionStorageCount + 1 })}>
          Set session storage
        </button>
      </div>
    )
  }
}

const ButtonsEnhanced = withStorageContext(Buttons)

class App extends PureComponent {
  state = {
    localStorageCount: 0,
    sessionStorageCount: 0
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        <DisplayLocalStorage />
        <Consumer>{({ session }) => <div>Session storage values{JSON.stringify(session, undefined, 4)}</div>}</Consumer>
        <ButtonsEnhanced />
      </div>
    )
  }
}

export default StorageContext("test-storage")(App)
